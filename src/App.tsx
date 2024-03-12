import React from "react";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Json from "./pages/Json";
import Text from "./pages/Text";

function App() {
  const [currentTab, setCurrentTab] = useState(1);
  const [jsonData, setJsonData] = useState({ old: "", new: "" });
  const [textData, setTextData] = useState({ old: "", new: "" });
  const [updateTextArea, setUpdateTextArea] = useState([0, 0]);

  const clearData = (typeOfInput: string) => {
    if (typeOfInput === "text") {
      setTextData({ old: "", new: "" });
    } else if (typeOfInput === "json") {
      setJsonData({ old: "", new: "" });
      setUpdateTextArea([0, 0]);
    }
  };
  return (
    <div className="App h-screen">
      <div className="mb-2">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>
      {currentTab === 2 && (
        <Json
          jsonData={jsonData}
          setJsonData={setJsonData}
          clearData={clearData}
          setUpdateTextArea={setUpdateTextArea}
          updateTextArea={updateTextArea}
        />
      )}
      {currentTab === 1 && (
        <Text
          clearData={clearData}
          textData={textData}
          setTextData={setTextData}
        />
      )}
    </div>
  );
}

export default App;
