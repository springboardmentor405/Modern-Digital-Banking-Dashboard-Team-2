import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from "@mui/material";

const getColor = (type) => {
  switch (type) {
    case "Success":
      return "success";
    case "Warning":
      return "warning";
    case "Error":
      return "error";
    default:
      return "default";
  }
};

const AlertsTable = ({ alerts }) => {
  return (
    <Paper elevation={2} sx={{ borderRadius: 3 }}>
      <TableContainer>
        <Typography
          variant="h6"
          sx={{ padding: 2, fontWeight: 600 }}
        >
          Alerts & Warnings
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Description</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {alerts.map((alert, index) => (
              <TableRow
                key={index}
                hover
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Chip
                    label={alert.type}
                    color={getColor(alert.type)}
                    size="small"
                  />
                </TableCell>

                <TableCell>{alert.title}</TableCell>
                <TableCell>{alert.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AlertsTable;