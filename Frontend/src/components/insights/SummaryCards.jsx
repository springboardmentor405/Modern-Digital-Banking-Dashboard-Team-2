import React from "react";

const SummaryCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-5 shadow transition hover:shadow-lg hover:-translate-y-1">
        <p className="text-sm text-gray-500">Total Income</p>
        <h2 className="text-2xl font-semibold text-green-600">
          ₹{data.total_income ?? 0}
        </h2>
      </div>

      <div className="bg-white rounded-xl p-5 shadow transition hover:shadow-lg hover:-translate-y-1">
        <p className="text-sm text-gray-500">Total Expense</p>
        <h2 className="text-2xl font-semibold text-red-500">
          ₹{data.total_expense ?? 0}
        </h2>
      </div>
    </div>
  );
};

export default SummaryCards;