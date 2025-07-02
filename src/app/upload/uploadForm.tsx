"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [charCount, setCharCount] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setCharCount(null);
      // Try to read text content for .txt files only (for demo)
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.type === "text/plain") {
        const text = await selectedFile.text();
        setCharCount(text.length);
      } else {
        // For PDF/DOCX, we can't get char count in browser before upload
        setCharCount(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    setStatus("Uploading...");

    try {
      const res = await fetch("http://localhost:5000/api/ai/summarize-document", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ ${data.message}`);
      } else {
        if (data.currentCharCount && data.maxAllowedCharCount) {
          setStatus(
            `❌ ${data.error}\nYour document has ${data.currentCharCount} characters. The maximum allowed is ${data.maxAllowedCharCount}. Please upload a smaller file.`
          );
        } else {
          setStatus(`❌ ${data.error || "Upload failed"}`);
        }
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error uploading file.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-xl mt-20 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900">Upload Your File</h1>

      <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-black transition-all duration-200">
        <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-600">{file ? file.name : "Click to select a file (PDF/DOCX)"}</p>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.txt"
        />
      </label>

      {file && charCount !== null && (
        <p className="text-sm text-blue-700">Current character count: {charCount}</p>
      )}
      {file && charCount === null && (
        <p className="text-sm text-gray-500">Character count will be shown after upload for PDF/DOCX files.</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-40"
      >
        Upload
      </button>

      {status && (
        <p className="text-sm text-center mt-2 text-gray-700">{status}</p>
      )}
    </div>
  );
}
