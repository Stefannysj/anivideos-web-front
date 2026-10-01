import assert from 'node:assert/strict';
import test from 'node:test';
import { parseContentDetailResponse } from '../src/models/content.js';

const detail = {
  id: 'anime-test',
  title: 'Test',
  category: 'anime',
  categoryLabel: 'Anime',
  year: 2026,
  score: 8.5,
  maturity: '13+',
  format: '12 episodios',
  genres: ['Aventura'],
  artwork: '/posters/anime-test.svg',
  synopsis: 'Una historia ficticia para validar la ficha de detalle.',
  origin: 'Japon',
  status: 'En emision',
};

test('parseContentDetailResponse validates detail data', () => {
  const item = parseContentDetailResponse(detail);
  assert.equal(item.id, 'anime-test');
  assert.equal(item.origin, 'Japon');
  assert.equal(item.status, 'En emision');
});

test('parseContentDetailResponse rejects missing detail metadata', () => {
  const { synopsis: _synopsis, ...invalid } = detail;
  assert.throws(() => parseContentDetailResponse(invalid));
});
