import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  fetchBills,
  createBill,
  markBillPaid,
  deleteBill,
  updateBill,
} from "../services/bills";

/* ---------------- CONSTANTS ---------------- */
const categories = ["Utilities", "Subscriptions", "Rent", "Internet"];
const frequencies = ["Monthly", "Yearly", "One-time"];

/* ---------------- DATE NORMALIZER (KEY FIX) ---------------- */
const normalizeDate = (dateStr) => {
  // Already correct format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Convert DD-MM-YYYY → YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  return dateStr;
};

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    due_date: "",
    category: "Utilities",
    frequency: "Monthly",
    reminder: true,
  });

  /* ---------------- LOAD BILLS ---------------- */
  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await fetchBills();
      setBills(data);
    } catch {
      toast.error("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSave = async () => {
    if (!form.title || !form.amount || !form.due_date) {
      toast.warning("Please fill all required fields");
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      due_date: normalizeDate(form.due_date),
    };

    try {
      if (editingBillId) {
        await updateBill(editingBillId, payload);
        toast.success("Bill updated successfully");
      } else {
        await createBill(payload);
        toast.success("Bill added successfully");
      }

      closeModal();
      loadBills();
    } catch (err) {
      console.error("BILL SAVE ERROR:", err.response?.data || err);
      toast.error("Operation failed");
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (bill) => {
    setEditingBillId(bill.id);
    setForm({
      title: bill.title,
      amount: bill.amount,
      due_date: bill.due_date.includes("T")
        ? bill.due_date.split("T")[0]
        : bill.due_date,
      category: bill.category,
      frequency: bill.frequency,
      reminder: bill.reminder,
    });
    setShowModal(true);
  };

  /* ---------------- OTHER ACTIONS ---------------- */
  const handleMarkPaid = async (id) => {
    try {
      await markBillPaid(id);
      toast.success("Bill marked as paid");
      loadBills();
    } catch {
      toast.error("Failed to mark bill as paid");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBill(id);
      toast.success("Bill deleted");
      loadBills();
    } catch {
      toast.error("Failed to delete bill");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBillId(null);
    setForm({
      title: "",
      amount: "",
      due_date: "",
      category: "Utilities",
      frequency: "Monthly",
      reminder: true,
    });
  };

  /* ---------------- STATUS ---------------- */
  const getStatus = (bill) => {
    if (bill.is_paid) return "Paid";
    const today = new Date();
    const due = new Date(bill.due_date);
    return due < today ? "Overdue" : "Upcoming";
  };

  const statusStyle = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Overdue") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) return <p className="p-6">Loading bills...</p>;

  const overdueCount = bills.filter(b => getStatus(b) === "Overdue").length;
  const upcomingCount = bills.filter(b => getStatus(b) === "Upcoming").length;
  const paidCount = bills.filter(b => b.is_paid).length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bills & Payments</h1>
          <p className="text-sm text-gray-500">
            Manage recurring bills and payment reminders
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Bill
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Overdue" count={overdueCount} color="red" icon={<AlertCircle />} />
        <SummaryCard title="Upcoming" count={upcomingCount} color="yellow" icon={<Clock />} />
        <SummaryCard title="Paid" count={paidCount} color="green" icon={<CheckCircle />} />
      </div>

      {/* ACTIVE BILLS */}
      <div className="bg-white border rounded-xl divide-y">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Active Bills</h2>
        </div>

        {bills
        .filter((bill) => !bill.is_paid)
        .map((bill) => {

          const status = getStatus(bill);

          return (
            <div
              key={bill.id}
              className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 gap-4"
            >
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {bill.title}
                  <span className={`text-xs px-2 py-1 rounded-full ${statusStyle(status)}`}>
                    {status}
                  </span>
                </h3>

                <div className="text-sm text-gray-500 mt-1 space-y-1">
                  <p>Amount: ₹{bill.amount}</p>
                  <p>Due Date: {new Date(bill.due_date).toLocaleDateString()}</p>
                  <p>Category: {bill.category}</p>
                  <p>Frequency: {bill.frequency}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
  {!bill.is_paid && (
    <>
      <button
        onClick={() => handleMarkPaid(bill.id)}
        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        Mark Paid
      </button>

      <Pencil
        onClick={() => handleEdit(bill)}
        className="cursor-pointer text-blue-600"
        size={18}
      />
    </>
  )}

  <Trash2
    onClick={() => handleDelete(bill.id)}
    className="cursor-pointer text-red-500"
  />
</div>

            </div>
          );
        })}
      </div>

      {/* INFO */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        Smart Reminders: Email/SMS notifications are sent before due dates for enabled bills.
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                {editingBillId ? "Edit Bill" : "Add New Bill"}
              </h2>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <Input label="Bill Name *" value={form.title} onChange={v => setForm({ ...form, title: v })} />
              <Input label="Amount (₹) *" type="number" value={form.amount} onChange={v => setForm({ ...form, amount: v })} />
              <Input label="Due Date *" type="date" value={form.due_date} onChange={v => setForm({ ...form, due_date: v })} />
              <Select label="Category" options={categories} value={form.category} onChange={v => setForm({ ...form, category: v })} />
              <Select label="Frequency" options={frequencies} value={form.frequency} onChange={v => setForm({ ...form, frequency: v })} />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeModal}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                {editingBillId ? "Update Bill" : "Add Bill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- REUSABLE ---------------- */

function SummaryCard({ title, count, color, icon }) {
  const colors = {
    red: "bg-red-50 border-red-200 text-red-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    green: "bg-green-50 border-green-200 text-green-600",
  };

  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      />
    </div>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
