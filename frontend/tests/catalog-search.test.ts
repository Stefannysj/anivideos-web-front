import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCatalogQuery,
  defaultCatalogFilters,
  getCatalogFilterOptions,
  hasActiveCatalogFilters,
} from '../src/models/catalog-filters.js';
import type { ContentItem } from '../src/models/content.js';

const items: ContentItem[] = [
  {
    id: 'anime-one', title: 'One', category: 'anime', categoryLabel: 'Anime', year: 2026,
    score: 8.5, maturity: '13+', format: '12 episodios', genres: ['Acción', 'Drama'], artwork: '/posters/anime-one.svg',
  },
  {
    id: 'movie-two', title: 'Two', category: 'movie', categoryLabel: 'Película', year: 2025,
    score: 9, maturity: '13+', format: '2 h', genres: ['Drama', 'Aventura'], artwork: '/posters/movie-two.svg',
  },
];

test('catalog filters are inactive by default', () => {
  assert.equal(hasActiveCatalogFilters(defaultCatalogFilters), false);
  assert.equal(buildCatalogQuery(defaultCatalogFilters), '');
});

test('catalog query encodes user input and filter values', () => {
  const query = buildCatalogQuery({
    query: 'One & Two', category: 'anime', genre: 'Acción', year: 2026, minScore: 8.5, sort: 'score-desc',
  });
  const params = new URLSearchParams(query);
  assert.equal(params.get('q'), 'One & Two');
  assert.equal(params.get('category'), 'anime');
  assert.equal(params.get('genre'), 'Acción');
  assert.equal(params.get('year'), '2026');
  assert.equal(params.get('minScore'), '8.5');
  assert.equal(params.get('sort'), 'score-desc');
});

test('filter options are unique and sorted', () => {
  const options = getCatalogFilterOptions(items);
  assert.deepEqual(options.years, [2026, 2025]);
  assert.deepEqual(options.genres, ['Acción', 'Aventura', 'Drama']);
});
