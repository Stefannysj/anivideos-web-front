export type BannerCategory = 'Anime' | 'K-Drama' | 'Serie' | 'Película';

export interface FeaturedBanner {
  /** Stable identifier used later to relate comments to exactly one banner. */
  id: string;
  category: BannerCategory;
  eyebrow: string;
  title: string;
  synopsis: string;
  year: number;
  ageRating: string;
  format: string;
  genres: readonly string[];
  artwork: `/banners/${string}.svg`;
  sectionHref: `#${string}`;
}

const categories = new Set<BannerCategory>(['Anime', 'K-Drama', 'Serie', 'Película']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Validates featured banners received from the Python API. */
export function parseBannerResponse(value: unknown): FeaturedBanner[] {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error('Los banners recibidos no son válidos.');
  }

  return value.items.map((item): FeaturedBanner => {
    if (!isRecord(item)) throw new Error('Banner inválido.');
    const category = item.category;
    const artwork = item.artwork;
    const sectionHref = item.sectionHref;
    const genres = item.genres;

    if (
      typeof item.id !== 'string' || item.id.length === 0 ||
      typeof category !== 'string' || !categories.has(category as BannerCategory) ||
      typeof item.eyebrow !== 'string' ||
      typeof item.title !== 'string' || item.title.length === 0 ||
      typeof item.synopsis !== 'string' ||
      typeof item.year !== 'number' || !Number.isInteger(item.year) ||
      typeof item.ageRating !== 'string' ||
      typeof item.format !== 'string' ||
      !Array.isArray(genres) || !genres.every((genre) => typeof genre === 'string') ||
      typeof artwork !== 'string' || !/^\/banners\/[a-z0-9-]+\.svg$/.test(artwork) ||
      typeof sectionHref !== 'string' || !/^#[a-z0-9-]+$/.test(sectionHref)
    ) {
      throw new Error('Banner inválido.');
    }

    return {
      id: item.id,
      category: category as BannerCategory,
      eyebrow: item.eyebrow,
      title: item.title,
      synopsis: item.synopsis,
      year: item.year,
      ageRating: item.ageRating,
      format: item.format,
      genres,
      artwork: artwork as FeaturedBanner['artwork'],
      sectionHref: sectionHref as FeaturedBanner['sectionHref'],
    };
  });
}

/** Keeps the carousel index within its limits when moving forward or backward. */
export function wrapBannerIndex(currentIndex: number, offset: number, total: number): number {
  if (!Number.isInteger(currentIndex) || !Number.isInteger(offset) || !Number.isInteger(total) || total <= 0) {
    throw new Error('El carrusel recibio un índice o total inválido.');
  }
  return ((currentIndex + offset) % total + total) % total;
}
