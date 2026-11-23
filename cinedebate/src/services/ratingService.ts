import { apiFetch } from './api';

export interface RatingSummary {
  average: number;
  count: number;
}

// GET /api/ratings?title_id= (publico)
export async function getRatingSummary(titleId: number): Promise<RatingSummary> {
  const response = await apiFetch<{ data: RatingSummary }>(`/ratings?title_id=${titleId}`, { auth: false });
  return response.data;
}

// POST /api/ratings (requiere login; 1 a 5, se actualiza si ya habias calificado)
export async function rateTitle(titleId: number, value: number): Promise<RatingSummary> {
  const response = await apiFetch<{ data: RatingSummary }>('/ratings', {
    method: 'POST',
    body: { title_id: titleId, value },
  });
  return response.data;
}
