import type { ContentCategory, ContentItem } from './content.js';

export type CatalogSort = 'featured' | 'title-asc' | 'year-desc' | 'score-desc';
export type CatalogCategoryFilter = 'all' | ContentCategory;

export interface CatalogFilters {
  query: string;
  category: CatalogCategoryFilter;
  genre: string;
  year: number | null;
  minScore: number | null;
  status: string;
  format: string;
  sort: CatalogSort;
}

export interface CatalogFilterOptions {
  genres: string[];
  years: number[];
  statuses: string[];
  formats: string[];
}

export const defaultCatalogFilters: CatalogFilters = {
  query: '', category: 'all', genre: '', year: null, minScore: null, status: '', format: '', sort: 'featured',
};

export function hasActiveCatalogFilters(filters: CatalogFilters): boolean {
  return Boolean(filters.query.trim() || filters.category !== 'all' || filters.genre || filters.year !== null || filters.minScore !== null || filters.status || filters.format || filters.sort !== 'featured');
}

export function buildCatalogQuery(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  const query = filters.query.trim();
  if (query) params.set('q', query);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.genre) params.set('genre', filters.genre);
  if (filters.year !== null) params.set('year', String(filters.year));
  if (filters.minScore !== null) params.set('minScore', String(filters.minScore));
  if (filters.status) params.set('status', filters.status);
  if (filters.format) params.set('format', filters.format);
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  return params.toString();
}

export function getCatalogFilterOptions(items: readonly ContentItem[]): CatalogFilterOptions {
  const genres = [...new Set(items.flatMap((item) => item.genres))].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  const years = [...new Set(items.flatMap((item) => item.year === null ? [] : [item.year]))].sort((a, b) => b - a);
  const statuses = [...new Set(items.map((item) => item.status).filter(Boolean))].sort();
  const formats = [...new Set(items.map((item) => item.format).filter(Boolean))].sort();
  return { genres, years, statuses, formats };
}
