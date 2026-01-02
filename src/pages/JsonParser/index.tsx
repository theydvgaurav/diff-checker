import React, { useState } from "react";

function deepParseJson(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return deepParseJson(parsed);
    } catch {
      return value;
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepParseJson(item));
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    Object.entries(value).forEach(([key, val]) => {
      result[key] = deepParseJson(val);
    });
    return result;
  }

  return value;
}

const JsonParser: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleParse = () => {
    try {
      const root = JSON.parse(input);
      const parsed = deepParseJson(root);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (e) {
      setError("Root input must be valid JSON. Please check your input.");
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
      <h1 className="text-xl font-semibold mb-2">JSON Parser</h1>
      <p className="text-sm text-slate-600 mb-4">
        Recursively parses nested stringified JSON values inside objects and
        arrays.
      </p>
      <div className="flex flex-row gap-4">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="mb-2 font-semibold text-slate-800">
            Input (root must be valid JSON)
          </h2>
          <textarea
            className="h-[calc(100vh-280px)] w-full border rounded-lg p-4 resize-none overflow-y-scroll bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#FF5B91]/60"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Example: {"data":"{\\"foo\\":{\\"bar\\":\\"baz\\"}}"}'
          />
          <button
            type="button"
            onClick={handleParse}
            className="mt-3 bg-[#11AE87] text-white rounded-full py-2 px-6 hover:bg-emerald-300 hover:text-black transition"
          >
            Parse JSON
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">
              Recursively Parsed JSON
            </h3>
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
          <pre className="h-[calc(100vh-280px)] w-full border rounded-lg p-4 overflow-y-scroll bg-slate-50 text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JsonParser;
