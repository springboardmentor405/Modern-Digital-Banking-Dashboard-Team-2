import React from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../auth";

export default function Header({ onOpenSidebar = () => {} }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onOpenSidebar} aria-label="Open menu" className="p-2 rounded-md hover:bg-slate-100 md:hidden">
          ☰
        </button>
        <div>
          <h1 className="text-lg font-semibold">Overview</h1>
          <p className="text-sm text-slate-500">Welcome back — here’s what's happening with your accounts</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <div className="font-medium">{user?.name || user?.email || "User"}</div>
          <div className="text-xs text-slate-500">Member</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="px-3 py-1 rounded border text-sm">
            Logout
          </button>
          <div className="w-9 h-9 bg-slate-200 rounded-full" />
        </div>
      </div>
    </header>
  );
}
