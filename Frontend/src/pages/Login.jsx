import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputWithIcon from "../components/InputWithIcon";
import ForgotPassword from "../components/ForgotPassword";
import { login } from "../auth";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });

      // ✅ Success toast
      toast.success("Login successful 🎉");

      // ⏳ Let toast render
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      const msg = err.message || "Invalid email or password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const EmailIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 6.5h18v11H3z" />
      <path d="M3 6.5l9 7 9-7" />
    </svg>
  );

  const LockIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V8a5 5 0 0110 0v3" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
              <path d="M20 21a8 8 0 10-16 0" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Welcome</h2>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <InputWithIcon
              icon={EmailIcon}
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <InputWithIcon
              icon={LockIcon}
              type={showPassword ? "text" : "password"}
              showToggle
              isVisible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {/* Signup */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && <ForgotPassword onClose={() => setForgotOpen(false)} />}
    </div>
  );
}
