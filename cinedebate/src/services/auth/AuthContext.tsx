import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_EXPIRED_EVENT } from '../api';
import { loginRequest, registerRequest } from './authService';
import { AuthUser, clearSession, getStoredUser, getToken, saveSession } from './tokenStorage';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// La sesion se considera valida solo si hay token vigente y datos de usuario guardados
function loadInitialUser(): AuthUser | null {
  const token = getToken();
  const user = getStoredUser();
  if (token && user) return user;
  clearSession();
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(loadInitialUser);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedUser } = await loginRequest(email, password);
    saveSession(token, loggedUser);
    setUser(loggedUser);
  }, []);

  // Registra y deja la sesion iniciada
  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await registerRequest(username, email, password);
      await login(email, password);
    },
    [login]
  );

  // Si el servidor responde 401 (token expirado), se cierra la sesion
  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, logout);
  }, [logout]);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
