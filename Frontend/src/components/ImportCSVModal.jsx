import React, { useState } from "react";
import { X, Upload, FileText, Trash2 } from "lucide-react";
import { importCSV } from "../services/transactions";

export default function ImportCSVModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!file) return;
    try {
      setLoading(true);
      await importCSV(file);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              Import Transactions from CSV
            </h2>
            <p className="text-sm text-gray-500">
              Upload a CSV file to bulk import your transactions.
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* UPLOAD AREA */}
        {!file && (
          <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
            <Upload className="mb-3 text-gray-400" size={32} />
            <p className="text-sm">Drag and drop your CSV file here</p>
            <span className="text-xs text-gray-400 my-2">or</span>
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Browse Files
            </span>
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        )}

        {/* FILE PREVIEW (THIS WAS MISSING ✅) */}
        {file && (
          <div className="border rounded-xl p-4 flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <FileText className="text-indigo-600" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}

        {/* SAMPLE */}
        <div className="bg-gray-50 border rounded-xl p-4 mt-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">Sample CSV Format</p>
            <a
              href="/sample-transactions.csv"
              download
              className="text-blue-600 text-sm"
            >
              Download Sample
            </a>
          </div>
          <p className="text-xs text-gray-500">
            Date format: YYYY-MM-DD | Type: Income / Expense
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className={`px-6 py-2 rounded-lg text-white ${
              !file || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600"
            }`}
          >
            {loading ? "Importing..." : "Upload & Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
