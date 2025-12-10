import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:block">
      <h2 className="text-xl font-bold">Digital Bank</h2>
      <p className="text-sm text-slate-400">Dashboard</p>

      <nav className="mt-6 space-y-2">
        <div className="bg-slate-800 p-2 rounded">Overview</div>
        <div className="hover:bg-slate-800 p-2 rounded">Cards</div>
        <div className="hover:bg-slate-800 p-2 rounded">Wallets</div>
        <div className="hover:bg-slate-800 p-2 rounded">Customers</div>
        <div className="hover:bg-slate-800 p-2 rounded">Settings</div>
      </nav>
    </aside>
  );
}
