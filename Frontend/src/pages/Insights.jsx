import React, { useEffect, useState } from "react";
import axios from "axios";

import SummaryCards from "../components/insights/SummaryCards";
import CategoryList from "../components/insights/CategoryList";
import CashFlowChart from "../components/insights/CashFlowChart";
import AlertsTable from "../components/insights/AlertsTable";

import {
  exportInsightsCSV,
  exportInsightsPDF,
} from "../utils/exportUtils";

const API_BASE = "http://localhost:8000/insights";

const Insights = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [cashFlow, setCashFlow] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [range, setRange] = useState(30);

  const [showExport, setShowExport] = useState(false);

  /* 🔹 STATIC DATA */
  useEffect(() => {
    axios
      .get(`${API_BASE}/summary`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Summary error:", err));

    axios
      .get(`${API_BASE}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Categories error:", err));

    axios
      .get(`${API_BASE}/financial-metrics`)
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Metrics error:", err));

    axios
      .get(`${API_BASE}/alerts`)
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error("Alerts error:", err));
  }, []);

  /* 🔹 CASH FLOW (depends on range) */
  useEffect(() => {
    axios
      .get(`${API_BASE}/cash-flow?days=${range}`)
      .then((res) => setCashFlow(res.data))
      .catch((err) => console.error("Cash flow error:", err));
  }, [range]);

  if (!summary) {
    return <div className="p-6 text-gray-500">Loading insights…</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* 🔹 Header + Export Dropdown */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Financial Insights</h1>

        <div className="relative">
          <button
            onClick={() => setShowExport((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition flex items-center gap-2"
          >
            Export <span className="text-xs">▼</span>
          </button>

          {showExport && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  exportInsightsPDF({ summary, metrics, alerts });
                  setShowExport(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                Export as PDF
              </button>

              <button
                onClick={() => {
                  exportInsightsCSV({ summary, metrics, alerts });
                  setShowExport(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                Export as CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Financial Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Net Cash Flow",
              value: `₹${metrics.net_cash_flow}`,
              sub: "Last 30 days",
            },
            {
              label: "Daily Burn Rate",
              value: `₹${metrics.daily_burn_rate}`,
              sub: "Per day average",
            },
            {
              label: "Savings Rate",
              value: `${metrics.savings_rate}%`,
              sub: "Needs improvement",
            },
            {
              label: "Financial Runway",
              value: metrics.financial_runway,
              sub: "Positive flow",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow transition hover:shadow-lg hover:-translate-y-1"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <h2 className="text-2xl font-semibold mt-1">{card.value}</h2>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Alerts */}
      {alerts.length > 0 && <AlertsTable alerts={alerts} />}

      {/* 🔹 Summary */}
      <SummaryCards data={summary} />

      {/* 🔹 Categories */}
      <CategoryList data={categories} />

      {/* 🔹 Cash Flow Chart */}
      <div className="bg-white rounded-xl p-6 shadow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Cash Flow Analysis</h3>

          <div className="flex gap-2">
            {[30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  range === d
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {cashFlow.length > 0 ? (
          <CashFlowChart data={cashFlow} />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;