import assert from 'node:assert/strict';
import test from 'node:test';
import { filterContentByCategory, parseCatalogResponse } from '../src/models/content.js';

const payload = {
  items: [
    {
      id: 'anime-test', title: 'Test', category: 'anime', categoryLabel: 'Anime',
      year: 2026, score: 8.5, maturity: '13+', format: '12 episodios',
      genres: ['Aventura'], artwork: '/posters/anime-test.svg',
    },
  ],
};

test('parseCatalogResponse validates API data', () => {
  const items = parseCatalogResponse(payload);
  assert.equal(items.length, 1);
  assert.equal(items[0]?.id, 'anime-test');
  assert.equal(filterContentByCategory(items, 'anime').length, 1);
});

test('parseCatalogResponse rejects unsafe artwork paths', () => {
  assert.throws(() => parseCatalogResponse({ items: [{ ...payload.items[0], artwork: 'https://example.com/x.svg' }] }));
});
