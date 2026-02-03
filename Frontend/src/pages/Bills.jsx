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

/* Rewards + Transactions */
import { addRewardPoints } from "../services/rewards";
import { addTransaction } from "../services/transactions";

/* Bills API */
import {
  fetchBills,
  createBill,
  markBillPaid,
  deleteBill,
  updateBill,
} from "../services/bills";

/* MUI */
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Stack } from "@mui/material";

/* ---------------- CONSTANTS ---------------- */
const categories = ["Utilities", "Subscriptions", "Rent", "Internet"];
const frequencies = ["Monthly", "Yearly", "One-time"];

/* ---------------- DATE NORMALIZER ---------------- */
const normalizeDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
};

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Upcoming");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    due_date: "",
    category: "Utilities",
    frequency: "Monthly",
    reminder: true,
  });

  /* ---------------- LOAD ---------------- */
  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await fetchBills();
      setBills(data.map((b, i) => ({ ...b, id: b.id ?? i + 1 })));
    } catch {
      toast.error("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  /* ---------------- STATUS ---------------- */
  const getStatus = (bill) => {
    if (bill.is_paid) return "Paid";
    return new Date(bill.due_date) < new Date() ? "Overdue" : "Upcoming";
  };

  /* ---------------- FILTER ---------------- */
  const filteredBills = bills.filter((bill) => {
    const status = getStatus(bill);
    if (activeFilter === "Paid") return bill.is_paid;
    if (activeFilter === "Overdue") return !bill.is_paid && status === "Overdue";
    if (activeFilter === "Upcoming") return !bill.is_paid && status === "Upcoming";
    return false;
  });

  /* ---------------- ACTIONS ---------------- */
  const handleMarkPaid = async (bill) => {
    try {
      await markBillPaid(bill.id);

      await addTransaction({
        type: "Expense",
        amount: Number(bill.amount),
        category: bill.category || "Uncategorized",
        description: bill.title,
        date: new Date().toISOString().split("T")[0],
      });

      await addRewardPoints(10);

      toast.success("Bill paid successfully + 10 reward points 🎉");
      loadBills();
    } catch (error) {
      console.error(error);
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

  const handleEdit = (bill) => {
    setEditingBillId(bill.id);
    setForm({
      title: bill.title,
      amount: bill.amount,
      due_date: normalizeDate(bill.due_date),
      category: bill.category,
      frequency: bill.frequency,
      reminder: bill.reminder,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.amount || !form.due_date) {
      toast.warning("Fill all required fields");
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      due_date: normalizeDate(form.due_date),
    };

    try {
      editingBillId
        ? await updateBill(editingBillId, payload)
        : await createBill(payload);

      toast.success(editingBillId ? "Bill updated" : "Bill added");
      closeModal();
      loadBills();
    } catch {
      toast.error("Operation failed");
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

  if (loading) return <p className="p-6">Loading bills...</p>;

  /* ---------------- TABLE ---------------- */
  const columns = [
    { field: "title", headerName: "Bill", flex: 1.6 },

    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (p) => <span className="font-medium">₹{p.value}</span>,
    },

    {
      field: "due_date",
      headerName: "Due Date",
      flex: 1,
      renderCell: (p) => (
        <span className="text-sm text-gray-700">
          {normalizeDate(p.row.due_date)}
        </span>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (p) => {
        const status = getStatus(p.row);
        return (
          <Chip
            label={status}
            size="small"
            color={
              status === "Paid"
                ? "success"
                : status === "Overdue"
                ? "error"
                : "warning"
            }
            variant="outlined"
          />
        );
      },
    },

    {
  field: "actions",
  headerName: "Actions",
  flex: 2,
  align: "center",
  headerAlign: "center",
  sortable: false,
  renderCell: (params) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: "10px",
      }}
    >
      {!params.row.is_paid && (
        <button
          onClick={() => handleMarkPaid(params.row)}
          className="bg-green-600 text-white text-xs px-4 py-1.5 rounded-full hover:bg-green-700"
        >
          Mark Paid
        </button>
      )}

      <Pencil
        size={18}
        className="cursor-pointer text-blue-600 hover:text-blue-800"
        onClick={() => handleEdit(params.row)}
      />

      <Trash2
        size={18}
        className="cursor-pointer text-red-500 hover:text-red-700"
        onClick={() => handleDelete(params.row.id)}
      />
    </div>
  ),
}
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bills & Payments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Bill
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Overdue"
          count={bills.filter((b) => getStatus(b) === "Overdue").length}
          color="red"
          icon={<AlertCircle />}
          onClick={() => setActiveFilter("Overdue")}
        />
        <SummaryCard
          title="Upcoming"
          count={bills.filter((b) => getStatus(b) === "Upcoming").length}
          color="yellow"
          icon={<Clock />}
          onClick={() => setActiveFilter("Upcoming")}
        />
        <SummaryCard
          title="Paid"
          count={bills.filter((b) => b.is_paid).length}
          color="green"
          icon={<CheckCircle />}
          onClick={() => setActiveFilter("Paid")}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm">
        <div style={{ height: 520 }}>
          <DataGrid
            rows={filteredBills}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
            disableRowSelectionOnClick
          />
        </div>
      </div>

      {showModal && (
        <Modal
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={closeModal}
          editing={editingBillId}
        />
      )}
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

function SummaryCard({ title, count, color, icon, onClick }) {
  const colors = {
    red: "bg-red-50 border-red-200 text-red-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    green: "bg-green-50 border-green-200 text-green-600",
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-4 cursor-pointer hover:shadow ${colors[color]}`}
    >
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

function Modal({ form, setForm, onSave, onClose, editing }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">{editing ? "Edit Bill" : "Add Bill"}</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-4">
          <Input label="Bill Name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Input label="Amount" type="number" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} />
          <Input label="Due Date" type="date" value={form.due_date} onChange={(v) => setForm({ ...form, due_date: v })} />
          <Select label="Category" options={categories} value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Select label="Frequency" options={frequencies} value={form.frequency} onChange={(v) => setForm({ ...form, frequency: v })} />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            {editing ? "Update" : "Add"}
          </button>
        </div>
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