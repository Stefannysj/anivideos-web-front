import { parseCatalogResponse } from '../models/content.js';
import type { ContentItem } from '../models/content.js';
import { apiFetch, readJson } from './http.js';

export async function getRecommendations(baseUrl: string, signal?: AbortSignal): Promise<ContentItem[]> {
  const response = await apiFetch(`${baseUrl}/recommendations?limit=12`, { method: 'GET', signal });
  if (!response.ok) return [];
  return parseCatalogResponse(await readJson(response));
}
