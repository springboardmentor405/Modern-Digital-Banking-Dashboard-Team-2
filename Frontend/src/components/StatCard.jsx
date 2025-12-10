import React from "react";

export default function StatCard({ title, value, subtitle, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <p className="text-slate-500 text-sm">{title}</p>
      {}
      <h2 className="text-2xl font-semibold text-primary">{value}</h2>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      <div className="mt-3 h-10">{children}</div>
    </div>
  );
}