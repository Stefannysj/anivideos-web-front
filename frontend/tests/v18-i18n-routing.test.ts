import assert from 'node:assert/strict';
import test from 'node:test';
import { dictionaries, locales } from '../src/i18n/translations.js';
import { parseRoute, routeHref } from '../src/i18n/routes.js';

test('v18 ships complete dictionaries for all supported locales', () => {
  const reference = Object.keys(dictionaries.es).sort();
  assert.deepEqual([...locales], ['es','en','pt','fr']);
  for (const locale of locales) {
    assert.deepEqual(Object.keys(dictionaries[locale]).sort(), reference);
    for (const key of reference) assert.notEqual(dictionaries[locale][key as keyof typeof dictionaries.es], key);
  }
});

test('localized routes round-trip in every locale', () => {
  for (const locale of locales) {
    const detail = routeHref(locale, { kind:'detail', id:'anilist-123' });
    assert.deepEqual(parseRoute(detail), { locale, route:{ kind:'detail', id:'anilist-123' } });
    const calendar = routeHref(locale, { kind:'calendar' });
    assert.deepEqual(parseRoute(calendar), { locale, route:{ kind:'calendar' } });
    const privacy = routeHref(locale, { kind:'legal', page:'privacy' });
    assert.deepEqual(parseRoute(privacy), { locale, route:{ kind:'legal', page:'privacy' } });
  }
});
