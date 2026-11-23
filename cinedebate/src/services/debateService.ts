// Mismo patron que titleService.ts: una funcion por endpoint, tipada.
import { apiFetch } from './api';

export interface Debate {
  id: number;
  title_id: number;
  user_id: number;
  thesis: string;
  category: string;
  status: 'abierto' | 'cerrado';
  created_at: string;
}

// GET /api/debates?title_id= (publico)
export async function getDebatesByTitle(titleId: number): Promise<Debate[]> {
  const response = await apiFetch<{ data: Debate[] }>(`/debates?title_id=${titleId}`, { auth: false });
  return response.data;
}

// GET /api/debates/:id (publico)
export async function getDebate(id: number): Promise<Debate> {
  const response = await apiFetch<{ data: Debate }>(`/debates/${id}`, { auth: false });
  return response.data;
}

// POST /api/debates (requiere login)
export async function createDebate(title_id: number, thesis: string, category: string): Promise<Debate> {
  const response = await apiFetch<{ data: Debate }>('/debates', {
    method: 'POST',
    body: { title_id, thesis, category },
  });
  return response.data;
}
