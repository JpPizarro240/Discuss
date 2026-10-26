import { apiFetch } from './api';

export interface Title {
  id: number;
  name: string;
  type: 'pelicula' | 'serie';
  genre: string | null;
  release_year: number | null;
  synopsis: string | null;
  poster_url: string | null;
}

// GET /api/titles (publico)
export async function getTitles(): Promise<Title[]> {
  const response = await apiFetch<{ data: Title[] }>('/titles', { auth: false });
  return response.data;
}
