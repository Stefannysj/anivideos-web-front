import { parseAuthApiError } from '../models/auth.js';
import type { AuthApiError } from '../models/auth.js';
import { parseCatalogResponse } from '../models/content.js';
import type { ContentItem } from '../models/content.js';
import { parseFavoriteStateResponse } from '../models/favorite.js';
import type { FavoriteStateResponse } from '../models/favorite.js';
import { apiFetch, readJson } from './http.js';

export class FavoriteRequestError extends Error {
  readonly details: AuthApiError;

  constructor(details: AuthApiError) {
    super(details.message);
    this.name = 'FavoriteRequestError';
    this.details = details;
  }
}

/** Loads only the authenticated user's saved catalog items. */
export async function getFavorites(baseUrl: string, signal?: AbortSignal): Promise<ContentItem[]> {
  const response = await apiFetch(`${baseUrl}/favorites`, {
    method: 'GET',
    signal,
  });
  const payload = await readJson(response).catch(() => null);
  if (!response.ok) {
    throw new FavoriteRequestError(parseAuthApiError(payload, 'No fue posible cargar tus favoritos.'));
  }
  return parseCatalogResponse(payload);
}

/** Sets favorite state idempotently using PUT/DELETE rather than client-side-only storage. */
export async function setFavorite(
  baseUrl: string,
  contentId: string,
  isFavorite: boolean,
): Promise<FavoriteStateResponse> {
  const response = await apiFetch(`${baseUrl}/favorites/${encodeURIComponent(contentId)}`, {
    method: isFavorite ? 'PUT' : 'DELETE',
  });
  const payload = await readJson(response).catch(() => null);
  if (!response.ok) {
    throw new FavoriteRequestError(parseAuthApiError(payload, 'No fue posible actualizar tus favoritos.'));
  }
  return parseFavoriteStateResponse(payload);
}
