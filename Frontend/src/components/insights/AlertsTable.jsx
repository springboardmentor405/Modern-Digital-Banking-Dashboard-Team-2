import React from "react";

const typeStyles = {
  danger: "bg-red-50 text-red-700",
  warning: "bg-yellow-50 text-yellow-700",
  success: "bg-green-50 text-green-700",
};

const AlertsTable = ({ alerts }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Alerts & Warnings</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Type</th>
            <th className="pb-2">Title</th>
            <th className="pb-2">Description</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((alert, index) => (
            <tr
              key={index}
              className={`border-b last:border-0 ${typeStyles[alert.type]}`}
            >
              <td className="py-3 font-medium capitalize">
                {alert.type}
              </td>
              <td className="py-3 font-medium">
                {alert.title}
              </td>
              <td className="py-3">
                {alert.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsTable;