import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../auth";

export default function Overview() {
  const navigate = useNavigate();

  // 🔐 Safe user handling
  const user = getUser() || {};
  const displayName = user.name || user.email || "User";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NeoBank
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-600 hidden sm:block">
            Welcome, <strong>{displayName}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Main View */}
      <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">
            Account Dashboard
          </h1>
          <p className="text-slate-500">
            Monitor your activities and balance
          </p>
        </header>

        {/* Financial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Total Balance</p>
            <h3 className="text-3xl font-bold text-slate-900">$24,560.00</h3>
            <div className="mt-2 text-xs text-green-600 font-medium">
              +2.5% from last month
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Monthly Spending</p>
            <h3 className="text-3xl font-bold text-slate-900">$3,240.50</h3>
            <div className="mt-2 text-xs text-slate-400">
              On track for budget
            </div>
          </div>

          <div className="bg-linear-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
            <p className="text-sm opacity-80 mb-1">Savings Goal</p>
            <h3 className="text-3xl font-bold">$50,000.00</h3>
            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-full rounded-full"
                style={{ width: "48%" }}
              ></div>
            </div>
            <p className="mt-2 text-xs opacity-80">48% complete</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h4 className="font-semibold mb-4 text-slate-800">
            Recent Transactions
          </h4>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 1v22m11-11H1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Payment to Vendor {i}
                    </p>
                    <p className="text-xs text-slate-400">Dec 07, 2025</p>
                  </div>
                </div>
                <span className="font-semibold text-red-500">-$45.00</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
