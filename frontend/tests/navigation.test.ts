import assert from 'node:assert/strict';
import test from 'node:test';
import { navigationItems } from '../src/models/navigation.js';

test('v18 AniList-only navigation exposes catalog, anime and OVA sections', () => {
  const hrefs = new Set(navigationItems.map((item) => item.href));
  assert.deepEqual([...hrefs], ['#inicio', '#catalogo', '#anime', '#ovas']);
  assert.equal(hrefs.has('#k-dramas'), false);
  assert.equal(hrefs.has('#peliculas'), false);
});
