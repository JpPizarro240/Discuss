import { apiFetch } from '../api';
import { AuthUser } from './tokenStorage';

interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export function loginRequest(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function registerRequest(username: string, email: string, password: string): Promise<unknown> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { username, email, password },
    auth: false,
  });
}
