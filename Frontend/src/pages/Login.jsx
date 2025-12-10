import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputWithIcon from "../components/InputWithIcon";
import ForgotPassword from "../components/ForgotPassword";
import { login } from "../auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false); 

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    try { 
      await login({ email, password }); 
      navigate("/"); 
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const EmailIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 6.5h18v11H3z"/><path d="M3 6.5l9 7 9-7"/></svg>;
  const LockIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V8a5 5 0 0110 0v3"/></svg>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
             <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.3"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/><path d="M20 21a8 8 0 10-16 0"/></svg>
          </div>
          <h2 className="text-xl font-semibold">Welcome</h2>
          <p className="text-slate-500 text-sm">Sign in to manage your account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
          
          <label className="block text-sm text-slate-700 font-medium">Email Address</label>
          <InputWithIcon icon={EmailIcon} type="email" placeholder="Enter Email Address " required value={email} onChange={(e)=>setEmail(e.target.value)} />
          
          <label className="block text-sm text-slate-700 font-medium">Password</label>
          <InputWithIcon 
            icon={LockIcon} 
            type={showPassword ? "text" : "password"} 
            showToggle={true} 
            isVisible={showPassword} 
            onToggle={() => setShowPassword(!showPassword)} 
            required placeholder="Enter Password "
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
          />

          {/* Forgot Password Trigger */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-white font-medium bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity">
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline font-semibold">Sign up</Link></p>
      </div>

      {/* Forgot Password Modal Component */}
      {forgotOpen && <ForgotPassword onClose={() => setForgotOpen(false)} />}
    </div>
  );
}