import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

interface PrivateRouteProps extends RouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route {...rest} render={() => (isAuthenticated ? children : <Redirect to="/login" />)} />
  );
};

export default PrivateRoute;