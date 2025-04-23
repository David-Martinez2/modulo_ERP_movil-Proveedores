// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children; // Si hay token, permite acceder al contenido de la ruta protegida
};

export default ProtectedRoute;
