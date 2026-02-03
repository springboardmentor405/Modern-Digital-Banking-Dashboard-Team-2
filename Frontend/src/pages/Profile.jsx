import React, { useState } from "react";
import { Pencil, X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8000";

export default function Profile() {
  /* ---------- LOAD USER ---------- */
  let storedUser = {};
  try {
    storedUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    storedUser = {};
  }

  const userId = storedUser.id;
  const email = storedUser.email || "";

  /* ---------- STATES ---------- */
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [name, setName] = useState(storedUser.name || "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ---------- SAVE PROFILE ---------- */
  const saveProfile = async () => {
    if (!name.trim()) {
      toast.warning("Name cannot be empty");
      return;
    }

    try {
      await axios.put(`${API_BASE}/users/update-profile`, {
        user_id: userId,
        name,
      });

      const updatedUser = { ...storedUser, name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  /* ---------- CHANGE PASSWORD (NO OLD PASSWORD) ---------- */
  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.warning("Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${API_BASE}/users/change-password`, {
        user_id: userId,
        new_password: newPassword,
      });

      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 text-indigo-600"
        >
          <Pencil size={18} /> {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl p-6 shadow space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
            {name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        {/* NAME */}
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            disabled={!editMode}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full mt-1 px-3 py-2 border rounded-lg ${
              editMode ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            disabled
            value={email}
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          {editMode && (
            <button
              onClick={saveProfile}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              Save Changes
            </button>
          )}

        <div className="account-card">
        {
          <line-height>
            
          </line-height>
        }
        <h3>My Account</h3>
          <line-height>
            
          </line-height>
         <p><b>Account Number:</b> *******890</p>
          <p><b>Account Type:</b> Savings</p>
         
          <p><b>Status:</b> Active</p>
          

          <small style={{ color: "gray" }}>
            ⚠️ Only one account is supported for manual prototype
          </small>
        </div> 
        </div>
      </div>

      </div>
  );
}