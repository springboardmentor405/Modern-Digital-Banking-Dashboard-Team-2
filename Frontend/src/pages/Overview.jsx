import React, { useState, useEffect } from "react";

import {
  Eye,
  EyeOff,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Gift,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { fetchRewards } from "../services/rewards";
import { fetchCurrencySummary } from "../services/currency";

/* ---------- DATA ---------- */
const expenseTrendData = [
  { week: "Week 1", amount: 2800 },
  { week: "Week 2", amount: 3200 },
  { week: "Week 3", amount: 2900 },
  { week: "Week 4", amount: 3450 },
];

const categoryData = [
  { name: "Food", value: 1200 },
  { name: "Transport", value: 650 },
  { name: "Shopping", value: 1050 },
  { name: "Uncategorized", value: 519 },
];

const COLORS = ["#FB923C", "#3B82F6", "#A855F7", "#EF4444"];

export default function Overview() {
  const [showBalance, setShowBalance] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [currency, setCurrency] = useState(null);

  /* ---------- FETCH REWARDS ---------- */
  useEffect(() => {
    fetchRewards()
      .then((data) => setRewards(data.points))
      .catch(() => setRewards(0));
  }, []);

  /* ---------- FETCH CURRENCY ---------- */
  useEffect(() => {
    fetchCurrencySummary()
      .then(setCurrency)
      .catch(() => setCurrency(null));
  }, []);

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <StatCard
          title="Total Balance"
          value={showBalance ? "₹24,560" : "••••••"}
          subtitle="Current balance"
          icon={
            <div className="flex gap-2">
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOff /> : <Eye />}
              </button>
              <DollarSign className="text-blue-600" />
            </div>
          }
        />

        <StatCard
          title="Total Income"
          value={showIncome ? "₹18,000" : "••••••"}
          subtitle="This month"
          icon={
            <div className="flex gap-2">
              <button onClick={() => setShowIncome(!showIncome)}>
                {showIncome ? <EyeOff /> : <Eye />}
              </button>
              <TrendingUp className="text-green-600" />
            </div>
          }
        />

        <StatCard
          title="Total Expenses"
          value="₹3,419"
          subtitle="This month"
          valueColor="text-red-500"
          icon={<TrendingDown className="text-red-600" />}
        />

        <StatCard
          title="Savings"
          value="₹14,581"
          subtitle="This month"
          valueColor="text-purple-600"
          icon={<PiggyBank className="text-purple-600" />}
        />

        {/* 🎁 REWARD POINTS CARD */}
        <StatCard
          title="Reward Points"
          value={rewards}
          subtitle="Earned from bill payments"
          valueColor="text-purple-700"
          icon={<Gift className="text-purple-600" />}
        />

        {/* 💱 CURRENCY SUMMARY CARD */}
        {currency && (
          <StatCard
            title="Currency Summary"
            value={`1 INR = $${currency.rates.USD} / €${currency.rates.EUR}`}
            subtitle="Live exchange rate"
            valueColor="text-blue-700"
            icon={<DollarSign className="text-blue-600" />}
          />
        )}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Monthly Expense Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenseTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">
            Category-wise Spending Summary
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---------- CARD ---------- */
function StatCard({
  title,
  value,
  subtitle,
  icon,
  valueColor = "text-gray-900",
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm text-gray-600">{title}</h3>
        {icon}
      </div>
      <div className={`text-2xl font-bold mt-3 ${valueColor}`}>
        {value}
      </div>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
