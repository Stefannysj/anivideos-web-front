import { buildCatalogQuery } from '../models/catalog-filters.js';
import type { CatalogFilters } from '../models/catalog-filters.js';
import { parseCatalogResponse } from '../models/content.js';
import type { ContentItem } from '../models/content.js';

/** Loads catalog metadata from the Python API with optional server-side filters. */
export async function getCatalog(
  baseUrl: string,
  signal?: AbortSignal,
  filters?: CatalogFilters,
): Promise<ContentItem[]> {
  const query = filters ? buildCatalogQuery(filters) : '';
  const endpoint = `${baseUrl}/catalog${query ? `?${query}` : ''}`;
  const response = await fetch(endpoint, {
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
