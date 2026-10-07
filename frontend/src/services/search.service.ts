import { parseCatalogResponse } from '../models/content.js';
import type { ContentItem } from '../models/content.js';
import { apiFetch, readJson } from './http.js';

export async function getSearchSuggestions(baseUrl: string, query: string, signal?: AbortSignal): Promise<ContentItem[]> {
  const params = new URLSearchParams({ q: query, limit: '8' });
  const response = await apiFetch(`${baseUrl}/search/suggestions?${params}`, {
    method: 'GET', credentials: 'omit', cache: 'no-store', signal,
  });
  if (!response.ok) throw new Error('Search suggestions failed');
  return parseCatalogResponse(await readJson(response));
}
