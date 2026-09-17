export type ContentCategory = 'anime' | 'k-drama' | 'series' | 'movie';

export interface ContentItem {
  id: string;
  title: string;
  category: ContentCategory;
  categoryLabel: string;
  year: number;
  score: number;
  maturity: string;
  format: string;
  genres: readonly string[];
  artwork: `/posters/${string}.svg`;
}

export interface CatalogSection {
  id: 'anime' | 'k-dramas' | 'series' | 'peliculas';
  eyebrow: string;
  title: string;
  description: string;
  category: ContentCategory;
}

export const catalogSections = [
  {
    id: 'anime',
    eyebrow: 'Animación japonesa',
    title: 'Anime',
    description: 'Aventura, fantasía, ciencia ficción y nuevas historias por descubrir.',
    category: 'anime',
  },
  {
    id: 'k-dramas',
    eyebrow: 'Historias de Corea',
    title: 'K-Dramas',
    description: 'Romance, thriller, comedia y dramas contemporaneos en una sola colección.',
    category: 'k-drama',
  },
  {
    id: 'series',
    eyebrow: 'Para maratonear',
    title: 'Series',
    description: 'Temporadas y producciones episódicas organizadas para explorar con rapidez.',
    category: 'series',
  },
  {
    id: 'peliculas',
    eyebrow: 'Pantalla grande',
    title: 'Películas',
    description: 'Historias completas de distintos géneros preparadas para el futuro catálogo.',
    category: 'movie',
  },
] as const satisfies readonly CatalogSection[];

const categories = new Set<ContentCategory>(['anime', 'k-drama', 'series', 'movie']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Validates catalog data received from the Python API before rendering it. */
export function parseCatalogResponse(value: unknown): ContentItem[] {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error('El catálogo recibido no es válido.');
  }

  return value.items.map((item): ContentItem => {
    if (!isRecord(item)) throw new Error('Elemento de catálogo inválido.');

    const category = item.category;
    const artwork = item.artwork;
    const genres = item.genres;
    if (
      typeof item.id !== 'string' || item.id.length === 0 ||
      typeof item.title !== 'string' || item.title.length === 0 ||
      typeof category !== 'string' || !categories.has(category as ContentCategory) ||
      typeof item.categoryLabel !== 'string' ||
      typeof item.year !== 'number' || !Number.isInteger(item.year) ||
      typeof item.score !== 'number' || item.score < 0 || item.score > 10 ||
      typeof item.maturity !== 'string' ||
      typeof item.format !== 'string' ||
      !Array.isArray(genres) || !genres.every((genre) => typeof genre === 'string') ||
      typeof artwork !== 'string' || !/^\/posters\/[a-z0-9-]+\.svg$/.test(artwork)
    ) {
      throw new Error('Elemento de catálogo inválido.');
    }

    return {
      id: item.id,
      title: item.title,
      category: category as ContentCategory,
      categoryLabel: item.categoryLabel,
      year: item.year,
      score: item.score,
      maturity: item.maturity,
      format: item.format,
      genres,
      artwork: artwork as ContentItem['artwork'],
    };
  });
}

/** Returns one category without mutating the original API result. */
export function filterContentByCategory(
  items: readonly ContentItem[],
  category: ContentCategory,
): ContentItem[] {
  return items.filter((item) => item.category === category);
}
