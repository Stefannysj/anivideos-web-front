export type BannerCategory = 'Anime' | 'K-Drama' | 'Serie' | 'Película';

export interface FeaturedBanner {
  /** Identificador estable que más adelante servirá como relación para comentarios del banner. */
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

/** Mantiene el índice del carrusel dentro de sus límites al avanzar o retroceder. */
export function wrapBannerIndex(currentIndex: number, offset: number, total: number): number {
  if (!Number.isInteger(currentIndex) || !Number.isInteger(offset) || !Number.isInteger(total) || total <= 0) {
    throw new Error('El carrusel recibió un índice o total inválido.');
  }

  return ((currentIndex + offset) % total + total) % total;
}
