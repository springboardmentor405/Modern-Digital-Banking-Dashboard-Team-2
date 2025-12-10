export default function TransactionsTable({ transactions }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Recent Transactions</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-2">Title</th>
            <th>Date</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t">
              <td className="py-2">{tx.title}</td>
              <td className="text-slate-500">{tx.date}</td>
              <td
                className={`text-right font-medium ${
                  tx.amount > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {tx.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
