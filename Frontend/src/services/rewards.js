import api from "./api";

export const fetchRewards = async () => {
  const res = await axios.get("http://127.0.0.1:8000/rewards");
  return res.data;
};
