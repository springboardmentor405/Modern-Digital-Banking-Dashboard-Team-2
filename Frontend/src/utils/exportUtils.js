import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= CSV EXPORT ================= */
export const exportInsightsCSV = ({ summary, metrics, alerts }) => {
  const rows = [];

  if (summary) {
    rows.push(
      { Section: "Summary", Label: "Total Income", Value: summary.total_income },
      { Section: "Summary", Label: "Total Expense", Value: summary.total_expense }
    );
  }

  if (metrics) {
    rows.push(
      { Section: "Metrics", Label: "Net Cash Flow", Value: metrics.net_cash_flow },
      { Section: "Metrics", Label: "Daily Burn Rate", Value: metrics.daily_burn_rate },
      { Section: "Metrics", Label: "Savings Rate", Value: metrics.savings_rate },
      { Section: "Metrics", Label: "Financial Runway", Value: metrics.financial_runway }
    );
  }

  alerts.forEach((a, i) => {
    rows.push({
      Section: "Alerts",
      Label: `Alert ${i + 1}`,
      Value: `${a.type} - ${a.title}`,
    });
  });

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "financial_insights.csv");
};

/* ================= PDF EXPORT ================= */
export const exportInsightsPDF = ({ summary, metrics, alerts }) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Financial Insights Report", 14, 15);

  let y = 25;

  /* Summary */
  if (summary) {
    doc.setFontSize(12);
    doc.text("Summary", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Metric", "Value"]],
      body: [
        ["Total Income", summary.total_income],
        ["Total Expense", summary.total_expense],
      ],
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  /* Metrics */
  if (metrics) {
    doc.text("Financial Metrics", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Metric", "Value"]],
      body: [
        ["Net Cash Flow", metrics.net_cash_flow],
        ["Daily Burn Rate", metrics.daily_burn_rate],
        ["Savings Rate", `${metrics.savings_rate}%`],
        ["Financial Runway", metrics.financial_runway],
      ],
    });

    y = doc.lastAutoTable.finalY + 10;
  }

  /* Alerts */
  if (alerts && alerts.length > 0) {
    doc.text("Alerts", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Type", "Title", "Description"]],
      body: alerts.map((a) => [
        a.type,
        a.title,
        a.description || "-",
      ]),
    });
  }

  doc.save("financial_insights.pdf");
};