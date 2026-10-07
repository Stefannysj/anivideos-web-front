import { parseAuthApiError } from '../models/auth.js';
import type { AuthApiError } from '../models/auth.js';
import { parseLibraryResponse, parseLibraryState } from '../models/library.js';
import type { LibraryEntry, LibraryState, ProgressStatus } from '../models/library.js';
import { apiFetch, readJson } from './http.js';

export class LibraryRequestError extends Error {
  readonly details: AuthApiError;
  constructor(details: AuthApiError) { super(details.message); this.name = 'LibraryRequestError'; this.details = details; }
}

async function checked(response: Response, fallback: string): Promise<unknown> {
  const payload = await readJson(response).catch(() => null);
  if (!response.ok) throw new LibraryRequestError(parseAuthApiError(payload, fallback));
  return payload;
}

export async function getLibrary(baseUrl: string, signal?: AbortSignal): Promise<LibraryEntry[]> {
  const response = await apiFetch(`${baseUrl}/my-list`, { method: 'GET', signal });
  return parseLibraryResponse(await checked(response, 'No fue posible cargar Mi lista.'));
}

export async function setLibraryFavorite(baseUrl: string, contentId: string, value: boolean): Promise<LibraryState> {
  const response = await apiFetch(`${baseUrl}/my-list/${encodeURIComponent(contentId)}/favorite`, {
    method: value ? 'PUT' : 'DELETE',
  });
  return parseLibraryState(await checked(response, 'No fue posible actualizar favoritos.'));
}

export async function setLibraryProgress(baseUrl: string, contentId: string, status: ProgressStatus | null): Promise<LibraryState> {
  const response = await apiFetch(`${baseUrl}/my-list/${encodeURIComponent(contentId)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return parseLibraryState(await checked(response, 'No fue posible actualizar el estado.'));
}
