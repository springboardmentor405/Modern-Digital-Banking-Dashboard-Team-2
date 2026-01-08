import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { addTransaction } from "../services/transactions";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Salary",
  "Entertainment",
  "Uncategorized",
];

export default function AddTransactionModal({ onClose, onSuccess }) {
  const [type, setType] = useState("Expense");
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    description: "",
    date: "",
  });

  const handleSave = async () => {
    await addTransaction({ ...form, type });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Transaction</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TYPE */}
        <p className="text-sm mb-2">Type</p>
        <div className="flex gap-3 mb-4">
          {["Expense", "Income"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-lg border ${
                type === t
                  ? t === "Expense"
                    ? "border-red-500 text-red-600 bg-red-50"
                    : "border-green-500 text-green-600 bg-green-50"
                  : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* FIELDS */}
        <input
          type="number"
          placeholder="₹ 0.00"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <select
          className="w-full border rounded-lg px-3 py-2 mb-3"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter transaction description"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white"
          >
            <Plus size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
