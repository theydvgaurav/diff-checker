import React, { useState } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

interface DifferenceViewerProps {
  data: {
    old: string;
    new: string;
  };
  clearData: (typeOfInput: string) => void;
  typeOfInput: string;
  updateTextArea: number[];
}
const DifferenceViewer = ({
  data,
  clearData,
  typeOfInput,
  updateTextArea,
}: DifferenceViewerProps) => {
  const [splitView, setSplitView] = useState(false);

  return (
    <div className="mx-8 my-4 ">
      <div className="flex flex-row  pt-2 ">
        <div className="basis-1/2 ">
          <span className="text-2xl mr-4 ">Output View Format </span>
          <label className="relative mb-8 inline-flex items-center mr-5 cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer "
              onClick={() => {
                setSplitView(!splitView);
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
              {!splitView ? "Line By Line View" : "Split View"}
            </span>
          </label>
        </div>
        <div className="basis-1/2 flex flex-row-reverse mb-4 ">
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

      <ReactDiffViewer
        oldValue={
          updateTextArea[0] === 0
            ? data.old
            : JSON.stringify(data.old, undefined, 4)
        }
        newValue={
          updateTextArea[1] === 0
            ? data.new
            : JSON.stringify(data.new, undefined, 4)
        }
        splitView={splitView}
        compareMethod={DiffMethod.WORDS}
        leftTitle="Version A"
        rightTitle="Version B"
      />
    </div>
  );
};

export default DifferenceViewer;
