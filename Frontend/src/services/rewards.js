import axios from "axios";

const API_BASE = "http://localhost:8000/rewards";

export const fetchRewards = async () => {
  const res = await axios.get(`${API_BASE}/`);
  return res.data;
};

export const addRewardPoints = async (points = 10) => {
  await axios.post(`${API_BASE}/add?points=${points}`);
};