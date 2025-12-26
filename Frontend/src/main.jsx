import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔔 Toastify imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* Toast container (add only once) */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  </React.StrictMode>
);
