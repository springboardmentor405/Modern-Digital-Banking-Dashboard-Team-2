import api from "./api";

/* SEND OTP */
export const sendOtp = async (email) => {
  const res = await api.post("/auth/forgot-password", {
    email,
  });
  return res.data;
};

/* VERIFY OTP */
export const verifyOtp = async (email, otp) => {
  const res = await api.post("/auth/verify-otp", {
    email,
    otp,
  });
  return res.data;
};

/* RESET PASSWORD */
export const resetPassword = async (email, otp, new_password) => {
  const res = await api.post("/auth/reset-password", {
    email,
    otp,
    new_password,
  });
  return res.data;
};
