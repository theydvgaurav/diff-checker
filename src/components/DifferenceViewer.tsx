import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

interface DifferenceViewerProps {
  data: {
    old: string | object;
    new: string | object;
  };
  clearData: (typeOfInput: string) => void;
  typeOfInput: string;
  updateTextArea: number[];
  splitView: boolean;
  onSplitViewChange: (split: boolean) => void;
}

function toDiffString(value: string | object, uploaded: boolean): string {
  if (uploaded) {
    return JSON.stringify(value, null, 4);
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value, null, 4);
}

const SPLIT_MIN = 24;
const SPLIT_MAX = 76;

function clampPct(n: number) {
  return Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, n));
}

/** Share of the table for gutter + marker on each side (rest is code). */
const GUTTER_FR = 0.045;
const MARKER_FR = 0.028;

function removeSplitColgroup(table: HTMLTableElement) {
  table.querySelector("colgroup[data-diff-split]")?.remove();
  table.style.tableLayout = "";
  table.style.width = "";
}

/**
 * Drive split layout with <col> percentages so we don't fight emotion's per-td
 * width: 50% rules with mismatched pixel widths (that caused huge gaps).
 */
function applySplitColgroup(table: HTMLTableElement, leftPct: number) {
  const L = clampPct(leftPct);
  const R = 100 - L;
  const g1 = GUTTER_FR * 100;
  const m1 = MARKER_FR * 100;
  const c1 = Math.max(8, L - g1 - m1);
  const g2 = GUTTER_FR * 100;
  const m2 = MARKER_FR * 100;
  const c2 = Math.max(8, R - g2 - m2);

  let cg = table.querySelector(
    "colgroup[data-diff-split]"
  ) as HTMLTableColElement | null;
  if (!cg) {
    cg = document.createElement("colgroup");
    cg.setAttribute("data-diff-split", "1");
    for (let i = 0; i < 6; i++) {
      cg.appendChild(document.createElement("col"));
    }
    table.insertBefore(cg, table.firstChild);
  }

  const cols = cg.querySelectorAll("col");
  (cols[0] as HTMLTableColElement).style.width = `${g1}%`;
  (cols[1] as HTMLTableColElement).style.width = `${m1}%`;
  (cols[2] as HTMLTableColElement).style.width = `${c1}%`;
  (cols[3] as HTMLTableColElement).style.width = `${g2}%`;
  (cols[4] as HTMLTableColElement).style.width = `${m2}%`;
  (cols[5] as HTMLTableColElement).style.width = `${c2}%`;

  table.style.tableLayout = "fixed";
  table.style.width = "100%";
}

const diffStyles = {
  diffContainer: {
    width: "100%" as const,
  },
  contentText: {
    overflowWrap: "anywhere" as const,
    wordBreak: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
  },
  content: {
    verticalAlign: "top" as const,
    maxWidth: "100%" as const,
    paddingRight: 8,
  },
  lineNumber: {
    whiteSpace: "nowrap" as const,
  },
};

/** Avoid re-running diff + DOM when only the split drag handle moves. */
const MemoizedDiffTable = React.memo(
  function MemoizedDiffTable({
    oldValue,
    newValue,
    splitView,
    compareMethod,
    disableWordDiff,
  }: {
    oldValue: string;
    newValue: string;
    splitView: boolean;
    compareMethod: DiffMethod;
    disableWordDiff: boolean;
  }) {
    return (
      <ReactDiffViewer
        oldValue={oldValue}
        newValue={newValue}
        splitView={splitView}
        compareMethod={compareMethod}
        disableWordDiff={disableWordDiff}
        showDiffOnly
        extraLinesSurroundingDiff={4}
        leftTitle="Version A"
        rightTitle="Version B"
        styles={diffStyles}
      />
    );
  },
  (prev, next) =>
    prev.oldValue === next.oldValue &&
    prev.newValue === next.newValue &&
    prev.splitView === next.splitView &&
    prev.compareMethod === next.compareMethod &&
    prev.disableWordDiff === next.disableWordDiff
);

function ResizableSplitShell({
  splitView,
  leftPct,
  onLeftPctChange,
  oldValue,
  newValue,
  children,
}: {
  splitView: boolean;
  leftPct: number;
  onLeftPctChange: (n: number) => void;
  oldValue: string;
  newValue: string;
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);

  const syncCols = useCallback(() => {
    const table = wrapRef.current?.querySelector("table");
    if (!table || !splitView) return;
    applySplitColgroup(table as HTMLTableElement, leftPct);
  }, [splitView, leftPct]);

  useLayoutEffect(() => {
    const table = wrapRef.current?.querySelector("table") as
      | HTMLTableElement
      | undefined;
    if (!table) return;

    if (!splitView) {
      removeSplitColgroup(table);
      return;
    }

    syncCols();
    const ro = new ResizeObserver(() => syncCols());
    ro.observe(table);
    return () => ro.disconnect();
  }, [splitView, syncCols, oldValue, newValue]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current || !wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      if (rect.width < 1) return;
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      onLeftPctChange(clampPct(pct));
    };
    const onUp = () => {
      if (!dragRef.current) return;
      dragRef.current = false;
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [onLeftPctChange]);

  const onHandleDown = (e: React.MouseEvent) => {
    if (!splitView) return;
    e.preventDefault();
    dragRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div ref={wrapRef} className="relative w-full min-w-0">
      {splitView && (
        <button
          type="button"
          aria-label="Drag to resize panes"
          title="Drag to resize"
          onMouseDown={onHandleDown}
          className="absolute top-0 bottom-0 z-20 w-3 -translate-x-1/2 cursor-col-resize rounded-sm border-x-2 border-slate-400/70 bg-slate-200/90 shadow-sm hover:bg-sky-200/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          style={{ left: `${leftPct}%` }}
        />
      )}
      {children}
    </div>
  );
}

const DifferenceViewer = ({
  data,
  clearData,
  typeOfInput,
  updateTextArea,
  splitView,
  onSplitViewChange,
}: DifferenceViewerProps) => {
  const oldFromUpload = updateTextArea[0] === 1;
  const newFromUpload = updateTextArea[1] === 1;
  const oldValue = useMemo(
    () => toDiffString(data.old, oldFromUpload),
    [data.old, oldFromUpload]
  );
  const newValue = useMemo(
    () => toDiffString(data.new, newFromUpload),
    [data.new, newFromUpload]
  );

  const deferredOld = useDeferredValue(oldValue);
  const deferredNew = useDeferredValue(newValue);
  const diffIsPending = deferredOld !== oldValue || deferredNew !== newValue;

  const compareMethod =
    typeOfInput === "json" ? DiffMethod.LINES : DiffMethod.WORDS;
  const disableWordDiff = typeOfInput === "json";

  const [leftSplitPct, setLeftSplitPct] = useState(50);

  return (
    <div className="mx-8 my-4 min-w-0">
      <div className="flex flex-row flex-wrap gap-2 pt-2 ">
        <div className="basis-1/2 min-w-0 grow">
          <span className="text-2xl mr-4 ">Output View Format </span>
          <label className="relative mb-8 inline-flex items-center mr-5 cursor-pointer">
            <input
              type="checkbox"
              checked={splitView}
              className="sr-only peer "
              onChange={() => {
                onSplitViewChange(!splitView);
              }}
            />
            <div
              className="w-10 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 
            border-2
            peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 
            peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
            after:absolute after:top-0.5  after:left-[2px] after:bg-white 
            after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
            after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
            ></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {splitView ? "Split View" : "Line By Line View"}
            </span>
          </label>
        </div>
        <div className="basis-1/2 flex flex-row-reverse mb-4 min-w-0 grow">
          <button
            type="button"
            onClick={() => {
              clearData(typeOfInput);
            }}
            className="bg-[#D3D3D3] rounded-full w-20 "
          >
            Clear
          </button>
        </div>
      </div>

      {diffIsPending && (
        <p className="mb-2 text-sm text-slate-500" aria-live="polite">
          Rendering diff…
        </p>
      )}

      <div className="w-full max-w-full min-w-0">
        <ResizableSplitShell
          splitView={splitView}
          leftPct={leftSplitPct}
          onLeftPctChange={setLeftSplitPct}
          oldValue={deferredOld}
          newValue={deferredNew}
        >
          <MemoizedDiffTable
            oldValue={deferredOld}
            newValue={deferredNew}
            splitView={splitView}
            compareMethod={compareMethod}
            disableWordDiff={disableWordDiff}
          />
        </ResizableSplitShell>
      </div>
    </div>
  );
};

export default DifferenceViewer;
