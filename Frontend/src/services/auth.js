import api from "./api";

export const signupUser = (data) => {
  return api.post("/auth/signup", data);
};

export const loginUser = (email, password) => {
  return api.post("/auth/login", null, {
    params: { email, password },
  });
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};
