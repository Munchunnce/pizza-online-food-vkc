import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { accessToken, user } = useSelector((state) => state.auth);

  // Agar token nahi hai, login page pe redirect
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Agar Redux store me user abhi null hai, localStorage se check karo
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = user || storedUser;

  // Agar user role admin nahi hai, home page pe redirect
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Sab check pass, route access allow
  return children;
};


export default AdminRoute;
