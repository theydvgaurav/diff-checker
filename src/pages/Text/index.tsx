import React, { useState, useEffect } from "react";
import DifferenceViewer from "../../components/DifferenceViewer";
// import { AiFillPlusCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TextProps {
  textData: {
    old: string;
    new: string;
  };
  clearData: (typeOfInput: string) => void;
  setTextData: React.Dispatch<
    React.SetStateAction<{
      old: string;
      new: string;
    }>
  >;
}
const Text = ({ textData, setTextData, clearData }: TextProps) => {
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  useEffect(() => {
    if (textData.old.length === 0 && textData.new.length === 0) {
      setIsDataSubmitted(false);
    }
  }, [textData.old, textData.new]);

  const notify = () =>
    toast.error(" Enter Valid Text!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const uploadOldText = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      setTextData({ ...textData, old: reader.result as string });
    };
  };
  const uploadNewText = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      setTextData({ ...textData, new: reader.result as string });
    };
  };

  return (
    <>
      {isDataSubmitted && (
        <DifferenceViewer
          updateTextArea={[0, 0]}
          data={textData}
          typeOfInput={"text"}
          clearData={clearData}
        />
      )}

      <div className="flex flex-row    items-center ">
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
            id="fileInput3"
            accept="text/plain"
            hidden
            onChangeCapture={(e: any) => {
              uploadOldText(e.target.files[0]);
            }}
          />
          <button
            type="button"
            onClick={() => {
              (
                document.getElementById("fileInput3") as HTMLInputElement
              ).click();
            }}
            className="bg-[#FF5B91] text-[#FFF6F9] h-10 mt-2 rounded-full px-4 w-55 "
          >
            <div className="flex flex-row">
              {/* <AiFillPlusCircle className=" mt-1 mr-2" /> */}
              <span>Upload Old Text</span>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (textData.old.length !== 0 && textData.new.length !== 0) {
              setIsDataSubmitted(true);
            } else {
              notify();
            }
          }}
          className=" w-32 bg-[#11AE87] text-white    rounded-full py-2 hover:bg-emerald-300 hover:text-[black] "
        >
          Compare
        </button>

        <div className="flex h-[60px] basis-2/5 mr-8 place-content-center  w-full">
          <input
            type="file"
            id="fileInput4"
            accept="text/plain"
            hidden
            onChangeCapture={(e: any) => {
              uploadNewText(e.target.files[0]);
            }}
          />
          <button
            type="button"
            onClick={() => {
              (
                document.getElementById("fileInput4") as HTMLInputElement
              ).click();
            }}
            className="bg-[#FF5B91] text-[#FFF6F9] h-10 mt-2 px-4 rounded-full w-55"
          >
            <div className="flex flex-row">
              {/* <AiFillPlusCircle className=" mt-1 mr-2" /> */}
              <span>Upload New Text</span>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-row">
        <textarea
          value={textData.old}
          onInput={(e: React.SyntheticEvent<EventTarget>) => {
            setTextData({
              ...textData,
              old: (e.target as HTMLInputElement).value,
            });
          }}
          className="h-[calc(100vh-200px)] w-full border-2 rounded-lg mx-4 p-4 resize-none overflow-y-scroll  bg-slate-50"
        ></textarea>
        <textarea
          value={textData.new}
          onChange={(e: React.SyntheticEvent<EventTarget>) => {
            setTextData({
              ...textData,
              new: (e.target as HTMLInputElement).value,
            });
          }}
          className="h-[calc(100vh-200px)] rounded-lg  p-4 w-full border-2 mx-4 resize-none overflow-y-scroll  bg-slate-50"
        ></textarea>
      </div>
    </>
  );
};

export default Text;
