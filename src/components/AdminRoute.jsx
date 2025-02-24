import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    // Periksa apakah token memiliki username (yang mengindikasikan admin)
    if (!decoded.username) {
      localStorage.removeItem("authToken");
      return <Navigate to="/admin-login" replace />;
    }
  } catch (error) {
    localStorage.removeItem("authToken");
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;