import { apiFetch } from './api';

export interface VoteCounts {
  useful: number;
  not_useful: number;
}

export interface Argument {
  id: number;
  debate_id: number;
  user_id: number;
  parent_id: number | null;
  stance: 'a_favor' | 'en_contra' | 'neutral';
  content: string;
  has_spoilers: boolean;
  created_at: string;
  votes: VoteCounts;
}

// GET /api/arguments?debate_id= (publico; incluye el conteo de votos de cada argumento)
export async function getArgumentsByDebate(debateId: number): Promise<Argument[]> {
  const response = await apiFetch<{ data: Argument[] }>(`/arguments?debate_id=${debateId}`, { auth: false });
  return response.data;
}

// POST /api/arguments (requiere login; la postura es obligatoria)
export async function createArgument(
  debate_id: number,
  stance: string,
  content: string,
  has_spoilers = false
): Promise<Argument> {
  const response = await apiFetch<{ data: Argument }>('/arguments', {
    method: 'POST',
    body: { debate_id, stance, content, has_spoilers },
  });
  return response.data;
}

// POST /api/arguments/:id/vote (requiere login; un voto por usuario, no se puede votar lo propio)
export async function voteArgument(argumentId: number, value: 1 | -1): Promise<VoteCounts> {
  const response = await apiFetch<{ data: { argument_id: number; votes: VoteCounts } }>(
    `/arguments/${argumentId}/vote`,
    { method: 'POST', body: { value } }
  );
  return response.data.votes;
}
