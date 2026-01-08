import api from "./api";


export const getBudgetSummary = async (month, year) => {
  const res = await api.get(`/budgets/summary/${month}/${year}`);
  return res.data;
};

export const createBudget = async (payload) => {
  const res = await api.post("/budgets", payload);
  return res.data;
};

