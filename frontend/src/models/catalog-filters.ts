import type { ContentCategory, ContentItem } from './content.js';

export type CatalogSort = 'featured' | 'title-asc' | 'year-desc' | 'score-desc';
export type CatalogCategoryFilter = 'all' | ContentCategory;

export interface CatalogFilters {
  query: string;
  category: CatalogCategoryFilter;
  genre: string;
  year: number | null;
  minScore: number | null;
  sort: CatalogSort;
}

export interface CatalogFilterOptions {
  genres: string[];
  years: number[];
}

export const defaultCatalogFilters: CatalogFilters = {
  query: '',
  category: 'all',
  genre: '',
  year: null,
  minScore: null,
  sort: 'featured',
};

/** Returns true only when the user changed at least one catalog exploration control. */
export function hasActiveCatalogFilters(filters: CatalogFilters): boolean {
  return Boolean(
    filters.query.trim() ||
    filters.category !== 'all' ||
    filters.genre ||
    filters.year !== null ||
    filters.minScore !== null ||
    filters.sort !== 'featured',
  );
}

/** Builds a bounded API query without manually concatenating user input into the URL. */
export function buildCatalogQuery(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  const query = filters.query.trim();

  if (query) params.set('q', query);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.genre) params.set('genre', filters.genre);
  if (filters.year !== null) params.set('year', String(filters.year));
  if (filters.minScore !== null) params.set('minScore', String(filters.minScore));
  if (filters.sort !== 'featured') params.set('sort', filters.sort);

  return params.toString();
}

/** Derives filter choices from the catalog already validated from the API. */
export function getCatalogFilterOptions(items: readonly ContentItem[]): CatalogFilterOptions {
  const genres = [...new Set(items.flatMap((item) => item.genres))]
    .sort((left, right) => left.localeCompare(right, 'es', { sensitivity: 'base' }));
  const years = [...new Set(items.map((item) => item.year))].sort((left, right) => right - left);
  return { genres, years };
}
