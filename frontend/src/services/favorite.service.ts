import { parseAuthApiError } from '../models/auth.js';
import type { AuthApiError } from '../models/auth.js';
import { parseCatalogResponse } from '../models/content.js';
import type { ContentItem } from '../models/content.js';
import { parseFavoriteStateResponse } from '../models/favorite.js';
import type { FavoriteStateResponse } from '../models/favorite.js';

export class FavoriteRequestError extends Error {
  readonly details: AuthApiError;

  constructor(details: AuthApiError) {
    super(details.message);
    this.name = 'FavoriteRequestError';
    this.details = details;
  }
}

async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

/** Loads only the authenticated user's saved catalog items. */
export async function getFavorites(baseUrl: string, signal?: AbortSignal): Promise<ContentItem[]> {
  const response = await fetch(`${baseUrl}/favorites`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    signal,
  });
  const payload = await readJson(response);
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
  const response = await fetch(`${baseUrl}/favorites/${encodeURIComponent(contentId)}`, {
    method: isFavorite ? 'PUT' : 'DELETE',
    headers: { Accept: 'application/json' },
    credentials: 'include',
    cache: 'no-store',
  });
  const payload = await readJson(response);
  if (!response.ok) {
    throw new FavoriteRequestError(parseAuthApiError(payload, 'No fue posible actualizar tus favoritos.'));
  }
  return parseFavoriteStateResponse(payload);
}
