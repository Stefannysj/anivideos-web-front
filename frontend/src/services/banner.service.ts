import { parseBannerResponse } from '../models/banner.js';
import type { FeaturedBanner } from '../models/banner.js';

/** Loads featured banners from the Python API with cancellation support. */
export async function getBanners(baseUrl: string, signal?: AbortSignal): Promise<FeaturedBanner[]> {
  const response = await fetch(`${baseUrl}/banners`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'omit',
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw new Error('No fue posible cargar los banners.');
  const payload: unknown = await response.json();
  return parseBannerResponse(payload);
}
