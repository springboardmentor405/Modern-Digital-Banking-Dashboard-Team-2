import api from "./api";

/* ================= FETCH ================= */
export const fetchTransactions = async () => {
  const res = await api.get("/transactions");
  return res.data;
};

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (id, category) => {
  await api.put(`/transactions/${id}/category`, { category });
};

/* ================= AUTO CATEGORIZE ================= */
export const autoCategorize = async () => {
  await api.post("/transactions/auto-categorize");
};

/* ================= ADD TRANSACTION ================= */
export const addTransaction = async (data) => {
  await api.post("/transactions", data);
};

/* ================= IMPORT CSV ================= */
export const importCsv = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  await api.post("/transactions/import-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
