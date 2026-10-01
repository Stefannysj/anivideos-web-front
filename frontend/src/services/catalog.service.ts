import { buildCatalogQuery } from '../models/catalog-filters.js';
import type { CatalogFilters } from '../models/catalog-filters.js';
import { parseCatalogResponse, parseContentDetailResponse } from '../models/content.js';
import type { ContentDetail, ContentItem } from '../models/content.js';

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


/** Loads a single catalog item from SQL using its stable public id. */
export async function getContentDetail(
  baseUrl: string,
  contentId: string,
  signal?: AbortSignal,
): Promise<ContentDetail> {
  if (!/^[a-z0-9-]{1,80}$/.test(contentId)) {
    throw new Error('Identificador de contenido invalido.');
  }
  const response = await fetch(`${baseUrl}/catalog/${encodeURIComponent(contentId)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'omit',
    cache: 'no-store',
    signal,
  });
  if (response.status === 404) throw new Error('Este titulo no existe o ya no esta disponible.');
  if (!response.ok) throw new Error('No fue posible cargar el detalle del titulo.');
  const payload: unknown = await response.json();
  return parseContentDetailResponse(payload);
}
