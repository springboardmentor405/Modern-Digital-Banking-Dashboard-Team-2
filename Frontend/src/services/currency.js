import axios from "axios";

export const fetchCurrencySummary = async () => {
  const res = await axios.get("http://127.0.0.1:8000/currency/summary");
  return res.data;
};
