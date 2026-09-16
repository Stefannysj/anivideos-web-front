import assert from 'node:assert/strict';
import test from 'node:test';
import { featuredBanners } from '../src/data/featured-banners.js';
import { wrapBannerIndex } from '../src/models/banner.js';

test('los banners mantienen identificadores únicos y arte local', () => {
  const ids = featuredBanners.map((banner) => banner.id);

  assert.equal(new Set(ids).size, ids.length);
  assert.ok(featuredBanners.length >= 2);
  assert.ok(featuredBanners.every((banner) => banner.artwork.startsWith('/banners/')));
  assert.ok(featuredBanners.every((banner) => banner.sectionHref.startsWith('#')));
});

test('el carrusel avanza y retrocede de forma circular', () => {
  assert.equal(wrapBannerIndex(0, 1, 4), 1);
  assert.equal(wrapBannerIndex(3, 1, 4), 0);
  assert.equal(wrapBannerIndex(0, -1, 4), 3);
  assert.equal(wrapBannerIndex(1, -2, 4), 3);
});

test('el carrusel rechaza valores inválidos', () => {
  assert.throws(() => wrapBannerIndex(0, 1, 0));
  assert.throws(() => wrapBannerIndex(0.5, 1, 4));
});
