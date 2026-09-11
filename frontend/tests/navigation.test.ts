import assert from 'node:assert/strict';
import test from 'node:test';
import { navigationItems } from '../src/models/navigation.js';

test('la navegación principal mantiene destinos internos únicos', () => {
  const hrefs = navigationItems.map((item) => item.href);

  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.ok(hrefs.every((href) => href.startsWith('#')));
  assert.equal(navigationItems[0]?.href, '#inicio');
});
