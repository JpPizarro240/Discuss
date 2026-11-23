// Capa de servicios: solo funciones que llaman a la API y tipan la
// respuesta. Las paginas (HomePage, TitleDetailPage) consumen esto, no
// hablan con fetch directamente.
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

// GET /api/titles/:id (publico)
export async function getTitleById(id: number): Promise<Title> {
  const response = await apiFetch<{ data: Title }>(`/titles/${id}`, { auth: false });
  return response.data;
}
