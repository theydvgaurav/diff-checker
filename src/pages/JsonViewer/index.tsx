import React, { useState } from "react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonNodeProps {
  label: string | null;
  value: JsonValue;
  depth?: number;
}

const JsonNode: React.FC<JsonNodeProps> = ({ label, value, depth = 0 }) => {
  const [collapsed, setCollapsed] = useState(depth > 0); // root expanded, children collapsed by default

  const isObject =
    value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);

  const toggle = () => {
    if (isObject || isArray) {
      setCollapsed((prev) => !prev);
    }
  };

  const indentClass = `pl-${Math.min(depth * 4, 12)}`;

  if (!isObject && !isArray) {
    return (
      <div className={`text-sm ${indentClass}`}>
        {label !== null && (
          <span className="font-semibold text-slate-700">{label}: </span>
        )}
        <span className="text-slate-800">
          {typeof value === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
    );
  }

  const size = isArray
    ? (value as JsonValue[]).length
    : Object.keys(value as Record<string, JsonValue>).length;
  const typeLabel = isArray ? `Array[${size}]` : `Object{${size}}`;

  return (
    <div className={`text-sm ${indentClass}`}>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1 text-left w-full"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-xs text-slate-700 mr-1">
          {collapsed ? "+" : "-"}
        </span>
        {label !== null && (
          <span className="font-semibold text-slate-700">{label}: </span>
        )}
        <span className="text-slate-500">{typeLabel}</span>
      </button>
      {!collapsed && (
        <div className="mt-1">
          {isArray
            ? (value as JsonValue[]).map((item, index) => (
                <JsonNode
                  key={index}
                  label={String(index)}
                  value={item}
                  depth={depth + 1}
                />
              ))
            : Object.entries(value as Record<string, JsonValue>).map(
                ([key, val]) => (
                  <JsonNode
                    key={key}
                    label={key}
                    value={val}
                    depth={depth + 1}
                  />
                )
              )}
        </div>
      )}
    </div>
  );
};

const JsonViewer: React.FC = () => {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<JsonValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleView = () => {
    try {
      const value = JSON.parse(input) as JsonValue;
      setParsed(value);
      setError(null);
    } catch (e) {
      setError("Invalid JSON. Please check your input.");
      setParsed(null);
    }
  };

  return (
    <div className="px-4 md:px-8 mt-4">
      <h1 className="text-xl font-semibold mb-2">JSON Viewer</h1>
      <p className="text-sm text-slate-600 mb-4">
        Paste JSON and explore it as a collapsible tree of objects and arrays.
      </p>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="mb-2 font-semibold text-slate-800">Input JSON</h2>
        <textarea
          className="h-[220px] w-full border rounded-lg p-4 resize-none overflow-y-scroll bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#FF5B91]/60"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste JSON here, e.g. {"foo":{"bar":[1,2,3]}}'
        />
        <button
          type="button"
          onClick={handleView}
          className="mt-3 bg-[#11AE87] text-white rounded-full py-2 px-6 hover:bg-emerald-300 hover:text-black transition"
        >
          View JSON
        </button>
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="mb-2 font-semibold text-slate-800">Tree View</h3>
        <div className="h-[260px] w-full border rounded-lg p-4 overflow-y-scroll bg-slate-50 text-sm">
          {parsed !== null ? (
            <JsonNode label={null} value={parsed} depth={0} />
          ) : (
            <span className="text-slate-400">
              Parsed JSON structure will appear here.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
