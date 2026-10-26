import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { UserRole } from '../services/auth/tokenStorage';

interface PrivateRouteProps {
  children: React.ReactElement;
  roles?: UserRole[]; // si se indica, solo esos roles pueden entrar
}

// Ruta protegida: sin sesion redirige al login; con rol no permitido, al catalogo.
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/app/home" replace />;

  return children;
};

export default PrivateRoute;
