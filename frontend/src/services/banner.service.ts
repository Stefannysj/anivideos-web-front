import { parseBannerResponse } from '../models/banner.js';
import type { FeaturedBanner } from '../models/banner.js';
import { apiFetch, readJson } from './http.js';

/** Loads featured banners as public metadata without attaching the session cookie. */
export async function getBanners(baseUrl: string, signal?: AbortSignal): Promise<FeaturedBanner[]> {
  const response = await apiFetch(`${baseUrl}/banners`, {
    method: 'GET',
    credentials: 'omit',
    signal,
  });
  if (!response.ok) throw new Error('No fue posible cargar los banners.');
  const payload: unknown = await readJson(response);
  return parseBannerResponse(payload);
}
