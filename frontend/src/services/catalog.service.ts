import { buildCatalogQuery } from '../models/catalog-filters.js';
import type { CatalogFilters } from '../models/catalog-filters.js';
import { parseCatalogResponse, parseContentDetailResponse } from '../models/content.js';
import type { ContentDetail, ContentItem } from '../models/content.js';
import { apiFetch, readJson } from './http.js';

export async function getCatalog(baseUrl:string, signal?:AbortSignal, filters?:CatalogFilters):Promise<ContentItem[]> {
  const query=filters?buildCatalogQuery(filters):''; const response=await apiFetch(`${baseUrl}/catalog${query?`?${query}`:''}`,{method:'GET',credentials:'omit',cache:'default',signal});
  if(!response.ok) throw new Error('No fue posible cargar el catálogo.'); return parseCatalogResponse(await readJson(response));
}

export async function getContentDetail(baseUrl:string,contentId:string,signal?:AbortSignal):Promise<ContentDetail>{
  if(!/^[a-z0-9-]{1,120}$/.test(contentId)) throw new Error('Identificador de contenido inválido.');
  const response=await apiFetch(`${baseUrl}/catalog/${encodeURIComponent(contentId)}`,{method:'GET',credentials:'omit',cache:'default',signal});
  if(response.status===404) throw new Error('Este título no existe o ya no está disponible.');
  if(!response.ok) throw new Error('No fue posible cargar el detalle del título.'); return parseContentDetailResponse(await readJson(response));
}
