import assert from 'node:assert/strict';
import test from 'node:test';
import { catalog } from '../src/data/catalog.js';
import { catalogSections, filterContentByCategory } from '../src/models/content.js';

test('el catálogo usa identificadores únicos y arte local', () => {
  const ids = catalog.map((item) => item.id);

  assert.equal(new Set(ids).size, ids.length);
  assert.ok(catalog.every((item) => item.artwork.startsWith('/posters/')));
  assert.ok(catalog.every((item) => item.score >= 0 && item.score <= 10));
  assert.ok(catalog.every((item) => item.genres.length >= 1));
});

test('cada sección principal tiene contenido suficiente para formar un carril', () => {
  for (const section of catalogSections) {
    const items = filterContentByCategory(catalog, section.category);
    assert.ok(items.length >= 5, `${section.title} debe tener al menos cinco títulos`);
    assert.ok(items.every((item) => item.category === section.category));
  }
});

test('el filtro devuelve una copia y no modifica el catálogo', () => {
  const anime = filterContentByCategory(catalog, 'anime');

  assert.notEqual(anime, catalog);
  assert.equal(anime.length, 6);
  assert.equal(catalog.length, 24);
});
