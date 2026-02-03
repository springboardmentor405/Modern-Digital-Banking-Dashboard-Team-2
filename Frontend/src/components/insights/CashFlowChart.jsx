import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography } from "@mui/material";

const CashFlowChart = ({ data }) => {
  const dates = data.map((d) => d.date);
  const income = data.map((d) => d.income);
  const expense = data.map((d) => d.expense);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        p: 3,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Cash Flow Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Daily income vs expenses
      </Typography>

      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: dates,
          },
        ]}
        series={[
          { data: income, label: "Income", color: "#16a34a" },
          { data: expense, label: "Expense", color: "#dc2626" },
        ]}
        height={300}
      />
    </Box>
  );
};

export default CashFlowChart;