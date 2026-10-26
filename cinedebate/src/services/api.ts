import { clearSession, getToken } from './auth/tokenStorage';

// URL base de la API. Se puede cambiar con VITE_API_URL en un archivo .env del frontend.
const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';

// Evento que se dispara cuando el servidor rechaza el token (expirado o invalido)
export const AUTH_EXPIRED_EVENT = 'cinedebate:auth-expired';

export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean; // false = no enviar el token (login, registro, rutas publicas)
}

// Wrapper de fetch: agrega el JWT, serializa JSON y unifica el manejo de errores.
export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, auth = true, headers: extraHeaders, ...rest } = options;

  const headers = new Headers(extraHeaders);
  if (body !== undefined) headers.set('Content-Type', 'application/json');

  const token = auth ? getToken() : null;
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa tu conexion e intenta de nuevo.');
  }

  let data: { error?: string; details?: string[] } | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    // Interceptor: si habia sesion y el servidor responde 401, se cierra la sesion
    if (response.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError(response.status, data?.error ?? 'Ocurrio un error inesperado', data?.details ?? []);
  }

  return data as T;
}
