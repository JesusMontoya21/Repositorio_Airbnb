// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Verifica si hay token
  if (!token) {
    return <Navigate to="/" />; // Si no hay token, redirige al login
  }
  return children; // Si hay token, permite el acceso
};

export default PrivateRoute;
