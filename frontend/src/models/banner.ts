export interface FeaturedBanner {
  id: string;
  contentId: string;
  source: 'anilist' | 'tmdb';
  sourceAttribution: string;
  category: string;
  eyebrow: string;
  title: string;
  synopsis: string;
  year: number;
  ageRating: string;
  format: string;
  genres: readonly string[];
  artwork: string;
  sectionHref: `#${string}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function allowedArtwork(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['s4.anilist.co', 's3.anilist.co', 'image.tmdb.org'].includes(url.hostname);
  } catch {
    return false;
  }
}

export function parseBannerResponse(value: unknown): FeaturedBanner[] {
  if (!isRecord(value) || !Array.isArray(value.items)) throw new Error('Los banners recibidos no son válidos.');
  return value.items.map((item): FeaturedBanner => {
    if (!isRecord(item) ||
      typeof item.id !== 'string' || typeof item.contentId !== 'string' ||
      (item.source !== 'anilist' && item.source !== 'tmdb') ||
      typeof item.sourceAttribution !== 'string' || typeof item.category !== 'string' ||
      typeof item.eyebrow !== 'string' || typeof item.title !== 'string' ||
      typeof item.synopsis !== 'string' || typeof item.year !== 'number' ||
      typeof item.ageRating !== 'string' || typeof item.format !== 'string' ||
      !Array.isArray(item.genres) || !item.genres.every((genre) => typeof genre === 'string') ||
      !allowedArtwork(item.artwork) || typeof item.sectionHref !== 'string' || !/^#[a-z0-9-]+$/.test(item.sectionHref)) {
      throw new Error('Banner inválido.');
    }
    return item as unknown as FeaturedBanner;
  });
}

export function wrapBannerIndex(currentIndex: number, offset: number, total: number): number {
  if (!Number.isInteger(currentIndex) || !Number.isInteger(offset) || !Number.isInteger(total) || total <= 0) {
    throw new Error('El carrusel recibió un índice o total inválido.');
  }
  return ((currentIndex + offset) % total + total) % total;
}
