import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "../auth";
import { Lightbulb } from "lucide-react";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  FileText,
  User,
} from "lucide-react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

let user = {};
try {
  user = JSON.parse(localStorage.getItem("user")) || {};
} catch (e) {
  user = {};
}

const displayName = user?.name || "U";
const email = user?.email || "";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-indigo-600 text-white"
      : "hover:bg-gray-100 text-gray-700";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      {/* HEADER */}
<nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
  <div className="flex items-center gap-4">
    <button onClick={() => setSidebarOpen(true)}>
      <Menu />
    </button>

    <div>
      <h1 className="font-semibold">Hello, {displayName} 👋</h1>
      <p className="text-sm text-gray-500">Manage your finances</p>
    </div>
  </div>

  {/* PROFILE AVATAR */}
  <button
    onClick={() => navigate("/profile")}
    className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
  >
    {displayName?.charAt(0)?.toUpperCase() || "U"}
  </button>
</nav>

      {/* SIDEBAR */}
      <div
        className={`fixed inset-0 z-40 ${
          sidebarOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-5 py-4 border-b">
            <div>
              <h2 className="font-semibold">Hello, {displayName} 👋</h2>
              <p className="text-sm text-gray-500">Manage your finances</p>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X />
            </button>
          </div>

          <div className="flex flex-col h-[calc(100%-80px)]">
            {/* MENU */}
            <nav className="p-4 space-y-2 flex-1">
              <button
                onClick={() => goTo("/")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${isActive("/")}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>

              <button
                onClick={() => goTo("/transactions")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${isActive("/transactions")}`}
              >
                <CreditCard size={18} />
                Transactions
              </button>

              <button
                onClick={() => goTo("/budgets")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${isActive("/budgets")}`}
              >
                <PiggyBank size={18} />
                Budgets
              </button>

              <button
                onClick={() => goTo("/bills")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${isActive("/bills")}`}
              >
                <FileText size={18} />
                Bills
              </button>

              <button
                onClick={() => navigate("/insights")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg ${
                  location.pathname === "/insights"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Lightbulb size={18} />
                Insights
              </button>
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t">
              <p className="text-sm text-gray-500 mb-3">{email}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* PAGE CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}