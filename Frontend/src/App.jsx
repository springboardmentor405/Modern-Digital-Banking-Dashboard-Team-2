import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import DashboardLayout from "./layouts/DashboardLayout";
import { isAuthenticated } from "./auth";
import Bills from "./pages/Bills";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected dashboard routes */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard home */}
          <Route index element={<Overview />} />

          {/* Transactions page */}
          <Route path="transactions" element={<Transactions />} />

          {/* Budgets page ✅ */}
          <Route path="budgets" element={<Budgets />} />

           <Route path="bills" element={<Bills />} />

           <Route path="/insights" element={<Insights />} />

           <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
