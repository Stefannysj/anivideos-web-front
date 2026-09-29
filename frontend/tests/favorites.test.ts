import assert from 'node:assert/strict';
import test from 'node:test';
import { parseFavoriteStateResponse } from '../src/models/favorite.js';

test('parseFavoriteStateResponse accepts backend favorite state', () => {
  assert.deepEqual(
    parseFavoriteStateResponse({ contentId: 'anime-skybound-echo', isFavorite: true }),
    { contentId: 'anime-skybound-echo', isFavorite: true },
  );
});

test('parseFavoriteStateResponse rejects malformed data', () => {
  assert.throws(() => parseFavoriteStateResponse({ contentId: 1, isFavorite: 'yes' }));
});
