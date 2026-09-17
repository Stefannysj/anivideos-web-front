import { parseCatalogResponse } from '../models/content.js';
import type { ContentItem } from '../models/content.js';

/** Loads catalog metadata from the Python API with cancellation support. */
export async function getCatalog(baseUrl: string, signal?: AbortSignal): Promise<ContentItem[]> {
  const response = await fetch(`${baseUrl}/catalog`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'omit',
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw new Error('No fue posible cargar el catálogo.');
  const payload: unknown = await response.json();
  return parseCatalogResponse(payload);
}
