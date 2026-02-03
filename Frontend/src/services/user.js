import axios from "axios";

const API = "http://localhost:8000/users";

export const fetchProfile = (email) =>
  axios.get(`${API}/me`, { params: { email } });

export const updateProfile = (email, name) =>
  axios.put(`${API}/me`, { name }, { params: { email } });