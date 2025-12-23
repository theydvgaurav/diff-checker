import React, { useState } from "react";

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (e) {
      setError("Invalid JSON. Please check your input.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="px-4 md:px-8 mt-4">
      <h1 className="text-xl font-semibold mb-4">JSON Formatter</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="mb-2 font-semibold text-slate-800">Input JSON</h2>
          <textarea
            className="h-[360px] w-full border rounded-lg p-4 resize-none overflow-y-scroll bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#FF5B91]/60"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here, e.g. {"foo":"bar"}'
          />
          <button
            type="button"
            onClick={handleFormat}
            className="mt-3 bg-[#11AE87] text-white rounded-full py-2 px-6 hover:bg-emerald-300 hover:text-black transition"
          >
            Format JSON
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-800">Formatted JSON</h2>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className={`text-xs rounded-full px-3 py-1 border ${
                output
                  ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                  : "border-slate-200 text-slate-300 cursor-not-allowed"
              } transition`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            className="h-[360px] w-full border rounded-lg p-4 resize-none overflow-y-scroll bg-slate-50 text-sm focus:outline-none"
            value={output}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
