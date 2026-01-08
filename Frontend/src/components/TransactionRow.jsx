import React from "react";
import { CATEGORIES } from "../utils/categories";

export default function TransactionRow({ txn, onCategoryChange }) {
  return (
    <div className="grid grid-cols-5 gap-4 items-center py-3 border-b last:border-0">
      <span className="text-sm text-gray-600">{txn.date}</span>

      <span className="text-sm font-medium text-gray-800">
        {txn.description}
      </span>

      <span
        className={`text-sm font-semibold ${
          txn.amount < 0 ? "text-red-500" : "text-green-600"
        }`}
      >
        ₹{Math.abs(txn.amount)}
      </span>

      <select
        value={txn.category}
        onChange={(e) =>
          onCategoryChange(txn.id, e.target.value)
        }
        className="border rounded-md px-2 py-1 text-sm"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button className="text-sm text-indigo-600 hover:underline">
        Save
      </button>
    </div>
  );
}
