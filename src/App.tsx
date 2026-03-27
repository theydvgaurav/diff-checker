import React from "react";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Json from "./pages/Json";
import Text from "./pages/Text";
import JsonFormatter from "./pages/JsonFormatter";
import JsonViewer from "./pages/JsonViewer";
import JsonParser from "./pages/JsonParser";

function App() {
  const [jsonData, setJsonData] = useState<{
    old: string | object;
    new: string | object;
  }>({ old: "", new: "" });
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
    <div className="App h-screen flex flex-col min-h-0">
      <div className="mb-2 shrink-0">
        <Navbar />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/text" replace />} />
          <Route
            path="/text"
            element={
              <Text
                clearData={clearData}
                textData={textData}
                setTextData={setTextData}
              />
            }
          />
          <Route
            path="/json/*"
            element={
              <Json
                jsonData={jsonData}
                setJsonData={setJsonData}
                clearData={clearData}
                setUpdateTextArea={setUpdateTextArea}
                updateTextArea={updateTextArea}
              />
            }
          />
          <Route path="/formatter" element={<JsonFormatter />} />
          <Route path="/viewer" element={<JsonViewer />} />
          <Route path="/parser" element={<JsonParser />} />
          <Route path="*" element={<Navigate to="/text" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
