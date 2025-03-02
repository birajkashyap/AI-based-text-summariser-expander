"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [length, setLength] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, length }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize.");
      }

      setSummary(data.response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        AI Text Summarizer
      </h1>

      {/* Textarea */}
      <div className="w-full max-w-lg">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your message
        </label>
        <textarea
          id="message"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Input for Length */}
      <div className="flex items-center space-x-2 mt-4">
        <label className="text-gray-900 dark:text-white text-sm font-medium">
          Summary Length:
        </label>
        <input
          type="number"
          className="w-20 p-1 border rounded text-center dark:bg-gray-700 dark:text-white"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={10}
          max={200}
        />
      </div>

      {/* Button */}
      <button
        className="mt-4 px-6 py-2.5 text-white bg-blue-500 rounded-lg font-medium text-sm transition duration-200 hover:bg-blue-600 disabled:opacity-50"
        onClick={handleSummarize}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0116 0H4z"
              ></path>
            </svg>
            <span>Summarizing...</span>
          </div>
        ) : (
          "Summarize"
        )}
      </button>

      {/* Error Message */}
      {error && <p className="mt-2 text-red-500 font-medium">{error}</p>}

      {/* Summary Result */}
      {summary && (
        <div className="w-full max-w-lg mt-6 p-4 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
          <h2 className="font-medium text-gray-900 dark:text-white">
            Summary:
          </h2>
          <p className="text-sm mt-1">{summary}</p>
        </div>
      )}
    </div>
  );
}
