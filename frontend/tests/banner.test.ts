import assert from 'node:assert/strict';
import test from 'node:test';
import { parseBannerResponse, wrapBannerIndex } from '../src/models/banner.js';

const payload = {
  items: [
    {
      id: 'banner-test', category: 'Anime', eyebrow: 'Destacado', title: 'Test',
      synopsis: 'Historia de prueba', year: 2026, ageRating: '13+', format: '12 episodios',
      genres: ['Aventura'], artwork: '/banners/banner-test.svg', sectionHref: '#anime',
    },
  ],
};

test('parseBannerResponse validates API data', () => {
  const items = parseBannerResponse(payload);
  assert.equal(items.length, 1);
  assert.equal(items[0]?.id, 'banner-test');
});

test('wrapBannerIndex wraps in both directions', () => {
  assert.equal(wrapBannerIndex(0, -1, 4), 3);
  assert.equal(wrapBannerIndex(3, 1, 4), 0);
});
