// Llamadas de login/registro a la API. Separado de AuthContext porque esto
// solo habla con el backend; AuthContext es el que despues decide que hacer
// con la respuesta (guardar sesion, actualizar el estado de React, etc.)
import { apiFetch } from '../api';
import { AuthUser } from './tokenStorage';

interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

// auth: false porque todavia no hay token (es justo lo que estamos pidiendo)
export function loginRequest(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

// No devuelve token: el registro solo crea el usuario, despues AuthContext
// llama a login() aparte para dejar la sesion iniciada (ver AuthContext.register)
export function registerRequest(username: string, email: string, password: string): Promise<unknown> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { username, email, password },
    auth: false,
  });
}
