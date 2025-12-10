import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { isAuthenticated } from "./auth";

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Dashboard */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          } 
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Global Catch-all redirect */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}