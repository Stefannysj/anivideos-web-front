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
    description: 'Romance, thriller, comedia y dramas contemporáneos en una sola colección.',
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

/** Devuelve los títulos de una categoría sin mutar el catálogo original. */
export function filterContentByCategory(
  items: readonly ContentItem[],
  category: ContentCategory,
): ContentItem[] {
  return items.filter((item) => item.category === category);
}
