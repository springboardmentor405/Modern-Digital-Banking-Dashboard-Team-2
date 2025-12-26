import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { sendOtp, verifyOtp, resetPassword } from "../services/authService";
import { Eye, EyeOff, Lock, Mail, Key } from "lucide-react";

export default function ForgotPassword({ onClose = () => {} }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* OTP TIMER */
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  /* STEP 1: SEND OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp(email);
      toast.success("OTP sent to your email 📩");
      setStep(2);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* OTP INPUT HANDLER */
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  /* STEP 2: VERIFY OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(email, otpValue);
      toast.success("OTP verified ✅");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* STEP 3: RESET PASSWORD */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, otp.join(""), newPassword);
      toast.success("Password reset successful 🎉");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
        >
          ✕
        </button>

        {/* ================= STEP 1: EMAIL ================= */}
        {step === 1 && (
          <>
            <h3 className="text-2xl font-bold mb-2">Reset your password</h3>
            <p className="text-sm text-slate-500 mb-6">
              Enter your registered email to receive OTP.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* ================= STEP 2: OTP ================= */}
        {step === 2 && (
          <>
            <h3 className="text-2xl font-bold mb-2">Verify OTP</h3>
            <p className="text-sm text-slate-600 mb-6">
              OTP sent to <strong>{email}</strong>
            </p>

            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Enter OTP
            </label>

            <div className="relative mb-6">
              <Key className="absolute -left-7 top-1/2 -translate-y-1/2 text-slate-400" />
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 border rounded-xl text-center text-xl font-bold"
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, index)
                    }
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
            </p>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3 bg-slate-700 text-white rounded-xl"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* ================= STEP 3: RESET PASSWORD ================= */}
{step === 3 && (
  <>
    <h3 className="text-2xl font-bold mb-6">Create new password</h3>

    <form onSubmit={handleResetPassword} className="space-y-5">
      {/* NEW PASSWORD */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Create Password
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showNewPassword ? "text" : "password"}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Confirm Password
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  </>
)}

      </div>
    </div>
  );
}
