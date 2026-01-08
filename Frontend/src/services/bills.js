import api from "./api";

/* ---------- FETCH BILLS ---------- */
export const fetchBills = async () => {
  const res = await api.get("/bills/");
  return res.data;
};

/* ---------- CREATE BILL ---------- */
export const createBill = async (data) => {
  const res = await api.post("/bills/", data);
  return res.data;
};

/* ---------- MARK BILL PAID (PATCH – FIXED) ---------- */
export const markBillPaid = async (billId) => {
  const res = await api.patch(`/bills/${billId}/mark-paid`);
  return res.data;
};

/* ---------- DELETE BILL ---------- */
export const deleteBill = async (billId) => {
  const res = await api.delete(`/bills/${billId}`);
  return res.data;
};
/* ---------- UPDATE BILL ---------- */
export const updateBill = (id, data) =>
  api.put(`/bills/${id}`, data);
