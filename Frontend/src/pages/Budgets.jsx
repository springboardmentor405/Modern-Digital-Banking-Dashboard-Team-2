import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify"; // ✅ ADDED
import { getBudgetSummary, createBudget } from "../services/budgets";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
  });

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await getBudgetSummary(month, year);
      setBudgets(data);
    } catch (err) {
      console.error("Failed to load budgets", err);
      toast.error("Failed to load budgets ❌"); // ✅ ADDED
    }
  };

  const handleSave = async () => {
    if (!form.amount) {
      toast.warning("Please enter budget amount ⚠️"); // ✅ ADDED
      return;
    }

    try {
      await createBudget({
        category: form.category,
        amount: Number(form.amount),
        month,
        year,
      });

      toast.success("Budget created successfully ✅"); // ✅ ADDED

      setShowModal(false);
      setForm({ category: "Food", amount: "" });
      loadBudgets();
    } catch (err) {
      console.error("Create budget failed", err);
      toast.error("Failed to create budget ❌"); // ✅ ADDED
    }
  };

  const progressColor = (percent) => {
    if (percent >= 100) return "bg-red-500";
    if (percent >= 80) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-sm text-gray-500">
            Manage your category-wise monthly spending
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Create Budget
        </button>
      </div>

      {/* BUDGET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const percent = Math.round((b.spent / b.budget) * 100);

          return (
            <div
              key={b.category}
              className="bg-white rounded-xl p-5 border shadow-sm"
            >
              <h3 className="font-semibold mb-3">{b.category}</h3>

              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Limit</span>
                  <span>₹{b.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Spent</span>
                  <span className="text-red-500">₹{b.spent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Remaining</span>
                  <span
                    className={
                      b.remaining < 0
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    ₹{b.remaining}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${progressColor(percent)}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUDGET VS SPENDING */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Budget vs Spending by Category
        </h2>

        <div className="space-y-4">
          {budgets.map((b) => {
            const percent = Math.round((b.spent / b.budget) * 100);

            return (
              <div key={b.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{b.category}</span>
                  <span>
                    ₹{b.spent} / ₹{b.budget}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className={`h-3 rounded-full ${progressColor(percent)}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INFO */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        Budgets update automatically based on your transactions. Keep track of
        your spending to stay within your budget limits.
      </div>

      {/* CREATE BUDGET MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Create Budget</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Monthly Limit (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
