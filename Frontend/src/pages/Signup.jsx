import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputWithIcon from "../components/InputWithIcon";
import { signup } from "../auth";

export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const UserIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/><path d="M20 21a8 8 0 10-16 0"/></svg>;
  const EmailIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 6.5h18v11H3z"/><path d="M3 6.5l9 7 9-7"/></svg>;
  const LockIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V8a5 5 0 0110 0v3"/></svg>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">+</div>
          <h2 className="text-xl font-semibold">Join Today</h2>
          <p className="text-slate-500 text-sm">Create an account to start banking</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm font-medium">{error}</div>}
          
          <label className="block text-sm text-slate-700 font-medium">Full Name</label>
          <InputWithIcon icon={UserIcon} type="text" required placeholder="Enter Your Full Name " value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
          
          <label className="block text-sm text-slate-700 font-medium">Email</label>
          <InputWithIcon icon={EmailIcon} type="email" required placeholder="Enter Your Email Address " value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} />
          
          <label className="block text-sm text-slate-700 font-medium">Password</label>
          <InputWithIcon icon={LockIcon} type={showPassword ? "text" : "password"} placeholder="Enter Your Password " showToggle={true} isVisible={showPassword} onToggle={()=>setShowPassword(!showPassword)} required value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} />

          {/* 3. Added the Confirm Password Input Field */}
          <label className="block text-sm text-slate-700 font-medium">Confirm Password</label>
          <InputWithIcon 
            icon={LockIcon} 
            type={showPassword ? "text" : "password"} 
            placeholder="Re-Enter Your Password" 
            showToggle={true}
            isVisible={showPassword} 
            onToggle={()=>setShowPassword(!showPassword)}
            required 
            value={formData.confirmPassword} 
            onChange={(e)=>setFormData({...formData, confirmPassword: e.target.value})} 
          />

          <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-lg text-white font-medium bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="text-indigo-600 hover:underline font-semibold">Login</Link></p>
      </div>
    </div>
  );
}