// Guarda y lee la sesion (JWT + datos basicos del usuario) en localStorage.
// Todo va en try/catch: localStorage puede no estar disponible (modo privado, etc.).

const TOKEN_KEY = 'cinedebate_token';
const USER_KEY = 'cinedebate_user';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
}

// Lee el campo "exp" del payload del JWT (sin verificar la firma: eso lo hace el servidor)
export function isTokenExpired(token: string): boolean {
  try {
    const payloadPart = token.split('.')[1];
    const json = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function getToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && !isTokenExpired(token) ? token : null;
  } catch {
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: AuthUser): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // sin almacenamiento: la sesion solo vivira en memoria
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // nada que limpiar
  }
}
