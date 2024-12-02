import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedPages() {
  // const userString = localStorage.getItem("user");
  // const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedPages;
