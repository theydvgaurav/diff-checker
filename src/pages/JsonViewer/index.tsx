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

const JsonNode: React.FC<JsonNodeProps> = ({ 
  label, 
  value, 
  depth = 0
}) => {
  const [collapsed, setCollapsed] = useState(depth > 0);

  const isObject =
    value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);

  const toggle = () => {
    if (isObject || isArray) {
      setCollapsed((prev) => !prev);
    }
  };

  const getTypeIcon = () => {
    if (isArray) {
      return (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-blue-100 text-[10px] text-blue-700 font-bold mr-2">
          []
        </span>
      );
    }
    if (isObject) {
      return (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-purple-100 text-[10px] text-purple-700 font-bold mr-2">
          {}
        </span>
      );
    }
    if (typeof value === "string") {
      return (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-blue-500 mr-2"></span>
      );
    }
    if (typeof value === "number") {
      return (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-green-500 mr-2"></span>
      );
    }
    if (typeof value === "boolean") {
      return (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-orange-500 mr-2"></span>
      );
    }
    return (
      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-gray-400 mr-2"></span>
    );
  };

  const getValueDisplay = () => {
    if (typeof value === "string") {
      return `"${value}"`;
    }
    if (value === null) {
      return "null";
    }
    return String(value);
  };

  const indentStyle = { paddingLeft: `${depth * 20}px` };

  if (!isObject && !isArray) {
    return (
      <div 
        className="text-sm py-1 hover:bg-slate-50 transition-colors"
        style={indentStyle}
      >
        <div className="flex items-center">
          {getTypeIcon()}
          {label !== null && (
            <span className="font-semibold text-slate-800 mr-2">{label}:</span>
          )}
          <span className="text-slate-800">
            {getValueDisplay()}
          </span>
        </div>
      </div>
    );
  }

  const size = isArray
    ? (value as JsonValue[]).length
    : Object.keys(value as Record<string, JsonValue>).length;
  const typeLabel = isArray ? `Array[${size}]` : `Object{${size}}`;

  return (
    <div>
      <div 
        className="text-sm py-1 hover:bg-slate-50 transition-colors"
        style={indentStyle}
      >
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-1 text-left w-full"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 mr-2 transition-colors">
            {collapsed ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
          {getTypeIcon()}
          {label !== null && (
            <span className="font-semibold text-slate-800 mr-2">{label}:</span>
          )}
          <span className="text-slate-800 font-medium">{typeLabel}</span>
        </button>
      </div>
      {!collapsed && (
        <div>
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
      <div className="flex flex-row gap-4">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="mb-2 font-semibold text-slate-800">Input JSON</h2>
          <textarea
            className="h-[calc(100vh-280px)] w-full border rounded-lg p-4 resize-none overflow-y-scroll bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#FF5B91]/60 font-mono text-sm"
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
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="mb-2 font-semibold text-slate-800">Tree View</h3>
          <div className="h-[calc(100vh-280px)] w-full border rounded-lg p-4 overflow-y-scroll bg-white text-sm">
            {parsed !== null ? (
              <JsonNode 
                label={null} 
                value={parsed} 
                depth={0}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-slate-400">
                  Parsed JSON structure will appear here.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
