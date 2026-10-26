import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

// Ruta solo para visitantes (login, registro): si ya hay sesion, redirige al catalogo.
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/app/home" replace /> : children;
};

export default PublicRoute;
