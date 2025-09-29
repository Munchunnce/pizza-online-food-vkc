import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.auth);

  // Agar accessToken nahi hai, login/register page pe redirect kar do
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Agar accessToken hai, route ko access do
  return children;
};

export default ProtectedRoute;