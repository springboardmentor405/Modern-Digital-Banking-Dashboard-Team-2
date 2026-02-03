import React, { useEffect, useState } from "react";
import { Upload, Sparkles, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import {
  fetchTransactions,
  updateCategory,
  importCsv,
  addTransaction,
  autoCategorize,
} from "../services/transactions";

/* MUI */
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";

/* ---------- CONSTANTS ---------- */
const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Salary",
  "Entertainment",
  "Uncategorized",
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvPreview, setCsvPreview] = useState([]);

  const [form, setForm] = useState({
    type: "Expense",
    amount: "",
    category: "Food",
    description: "",
    date: "",
  });

  /* ---------- LOAD DATA ---------- */
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await fetchTransactions();

      const normalized = data.map((t, index) => ({
        ...t,
        id: t.id ?? index + 1,
      }));

      setTransactions(normalized);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  /* ---------- ACTIONS ---------- */
  const handleCategoryChange = async (id, category) => {
    try {
      await updateCategory(id, category);
      toast.success("Category updated");
      loadTransactions();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleAutoCategorize = async () => {
    try {
      await autoCategorize();
      toast.success("Auto categorization completed");
      loadTransactions();
    } catch {
      toast.error("Auto categorization failed");
    }
  };

  /* ---------- CSV ---------- */
  const handleCsvSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split("\n").filter(Boolean);
      if (!rows.length) return;

      setCsvHeaders(rows[0].split(","));
      setCsvPreview(rows.slice(1, 6).map((r) => r.split(",")));
    };

    reader.readAsText(file);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.warning("Please select a CSV file");
      return;
    }

    try {
      await importCsv(csvFile);
      toast.success("CSV imported successfully");
      setShowCsvModal(false);
      setCsvFile(null);
      setCsvHeaders([]);
      setCsvPreview([]);
      loadTransactions();
    } catch {
      toast.error("CSV import failed");
    }
  };

  /* ---------- ADD TRANSACTION ---------- */
  const handleAddTransaction = async () => {
    if (!form.amount || !form.description || !form.date) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      await addTransaction(form);
      toast.success("Transaction added successfully");
      setShowAddModal(false);
      setForm({
        type: "Expense",
        amount: "",
        category: "Food",
        description: "",
        date: "",
      });
      loadTransactions();
    } catch {
      toast.error("Failed to add transaction");
    }
  };

  if (loading) return <p className="p-6">Loading transactions...</p>;

  /* ---------- MUI TABLE CONFIG ---------- */
  const columns = [
    {
  field: "date",
  headerName: "Date",
  flex: 1,
  renderCell: (params) => {
    const rawDate = params.row?.date;
    if (!rawDate) return "-";

    // Handles:
    // "2026-01-09T00:00:00"
    // "2026-01-09 00:00:00"
    // "2026-01-09"
    return String(rawDate).split("T")[0].split(" ")[0];
  },
},

    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => <span>₹{Math.abs(params.value)}</span>,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "Income" ? "success" : "error"}
          variant="outlined"
        />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1.5,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) =>
            handleCategoryChange(params.row.id, e.target.value)
          }
          className="border rounded px-2 py-1 text-sm"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Transactions</h1>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full border"
          >
            <Upload size={18} />
            Import CSV
          </button>

          <button
            onClick={handleAutoCategorize}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <Sparkles size={18} />
            Auto Categorize
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white bg-blue-600"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm">
        <div style={{ height: 520, width: "100%" }}>
          <DataGrid
            rows={transactions}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            disableRowSelectionOnClick
          />
        </div>
      </div>



      {/* ================= CSV MODAL ================= */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold text-lg">
                Import Transactions from CSV
              </h2>
              <button onClick={() => setShowCsvModal(false)}>
                <X />
              </button>
            </div>

            {!csvFile && (
              <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer">
                <Upload size={32} className="text-gray-400 mb-3" />
                <p className="text-sm">Upload CSV file</p>
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleCsvSelect}
                />
              </label>
            )}

            <div className="mt-4 bg-gray-50 border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Sample CSV format</p>
                <p className="text-xs text-gray-500">
                  date, type, amount, category, description
                </p>
              </div>
              <a
                href="/sample-transactions.csv"
                download
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                Download Sample
              </a>
            </div>

            {csvFile && (
              <>
                <p className="text-sm mt-3">
                  Selected file:
                  <span className="font-medium text-indigo-600 ml-1">
                    {csvFile.name}
                  </span>
                </p>

                <div className="overflow-x-auto border rounded-lg mt-3">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        {csvHeaders.map((h, i) => (
                          <th key={i} className="border px-2 py-1">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="border px-2 py-1">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCsvModal(false)}>Cancel</button>
              <button
                disabled={!csvFile}
                onClick={handleCsvUpload}
                className={`px-6 py-2 rounded-lg text-white ${
                  csvFile ? "bg-indigo-600" : "bg-gray-400"
                }`}
              >
                Upload & Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD TRANSACTION MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Add Transaction</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X />
              </button>
            </div>

            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex gap-3 mb-4">
              {["Expense", "Income"].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 rounded-lg border text-sm ${
                    form.type === t
                      ? t === "Expense"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="₹ 0.00"
              className="w-full border rounded-lg px-3 py-2 mb-3"
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            <select
              className="w-full border rounded-lg px-3 py-2 mb-3"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Description"
              className="w-full border rounded-lg px-3 py-2 mb-3"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button
                onClick={handleAddTransaction}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                + Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
