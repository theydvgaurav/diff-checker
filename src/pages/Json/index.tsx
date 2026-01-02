import React, { useState, useEffect } from "react";
import DifferenceViewer from "../../components/DifferenceViewer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface JsonProps {
  jsonData: {
    old: string;
    new: string;
  };
  clearData: (typeOfInput: string) => void;
  setJsonData: React.Dispatch<
    React.SetStateAction<{
      old: string;
      new: string;
    }>
  >;
  updateTextArea: number[];
  setUpdateTextArea: React.Dispatch<React.SetStateAction<number[]>>;
}
const JsonUpload = ({
  jsonData,
  setJsonData,
  clearData,
  updateTextArea,
  setUpdateTextArea,
}: JsonProps) => {
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const notify = () =>
    toast.error(" Enter Valid Json!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const uploadOldJson = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      const result = JSON.parse(reader.result as string);
      setUpdateTextArea(
        updateTextArea?.map((a, index) => (index === 0 ? 1 : a))
      );
      setJsonData({ ...jsonData, old: result });
    };
  };
  const uploadNewJson = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      const result = JSON.parse(reader.result as string);
      setUpdateTextArea(
        updateTextArea?.map((a, index) => (index === 1 ? 1 : a))
      );
      setJsonData({ ...jsonData, new: result });
    };
  };

  function isValidJson(json: string) {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    if (!isValidJson(jsonData.old) && !isValidJson(jsonData.new)) {
      setIsDataSubmitted(false);
    }
  }, [jsonData.old, jsonData.new]);

  return (
    <>
      {isDataSubmitted && (
        <DifferenceViewer
          data={jsonData}
          typeOfInput={"json"}
          clearData={clearData}
          updateTextArea={updateTextArea}
        />
      )}
      <div className="flex flex-row  items-center ">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          // type="error"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className=" flex h-[60px] basis-2/5 mr-12 ml-8  place-content-center  w-full">
          <input
            type="file"
            id="fileInput1"
            accept="application/json"
            hidden
            onChangeCapture={(e: any) => {
              uploadOldJson(e.target.files[0]);
            }}
          />
          <button
            type="button"
            onClick={() => {
              (
                document.getElementById("fileInput1") as HTMLInputElement
              ).click();
            }}
            className="bg-[#FF5B91]  text-[#FFF6F9] h-10 mt-2 rounded-full px-4 w-55 "
          >
            <div className="flex flex-row">
              <span>Upload Old Json</span>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            const isOldJsonValid =
              isValidJson(jsonData.old) || typeof jsonData.old === "object";
            const isNewJsonValid =
              isValidJson(jsonData.new) || typeof jsonData.new === "object";
            if (isOldJsonValid && isNewJsonValid) {
              setIsDataSubmitted(true);
            } else {
              notify();
            }
          }}
          className="w-32 bg-[#11AE87] text-white rounded-full py-2 hover:bg-emerald-300 hover:text-black "
        >
          Compare
        </button>

        <div className="flex h-[60px] basis-2/5 mr-8 place-content-center  w-full">
          <input
            type="file"
            id="fileInput2"
            accept="application/json"
            hidden
            onChangeCapture={(e: any) => {
              const file2 = e.target.files[0];
              uploadNewJson(file2);
            }}
          />
          <button
            type="button"
            onClick={() => {
              (
                document.getElementById("fileInput2") as HTMLInputElement
              ).click();
            }}
            className="bg-[#FF5B91] text-[#FFF6F9] h-10 mt-2 px-4 rounded-full w-55"
          >
            <div className="flex flex-row">
              <span>Upload New Json</span>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-row">
        <textarea
          value={
            updateTextArea[0] === 1
              ? JSON.stringify(jsonData.old, undefined, 4)
              : jsonData.old
          }
          onChange={(e: React.SyntheticEvent<EventTarget>) => {
            setUpdateTextArea(
              updateTextArea?.map((a, index) => (index === 0 ? 0 : a))
            );
            setJsonData({
              ...jsonData,
              old: (e.target as HTMLInputElement).value,
            });
          }}
          className="h-[calc(100vh-200px)] w-full rounded-lg border-2 p-4 mx-4 resize-none overflow-y-scroll  bg-slate-50"
        ></textarea>
        <textarea
          value={
            updateTextArea[1] === 1
              ? JSON.stringify(jsonData.new, undefined, 4)
              : jsonData.new
          }
          onChange={(e: React.SyntheticEvent<EventTarget>) => {
            setUpdateTextArea(
              updateTextArea?.map((a, index) => (index === 1 ? 0 : a))
            );
            setJsonData({
              ...jsonData,
              new: (e.target as HTMLInputElement).value,
            });
          }}
          className="h-[calc(100vh-200px)] w-full rounded-lg border-2 mx-4 p-4 resize-none overflow-y-scroll  bg-slate-50"
        ></textarea>
      </div>
    </>
  );
};

export default JsonUpload;
