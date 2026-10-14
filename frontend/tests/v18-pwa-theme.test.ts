import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('v18 exposes a valid installable manifest and service worker registration', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8')) as {display:string;icons:unknown[]};
  const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
  const serviceWorker = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.icons.length, 2);
  assert.match(main, /serviceWorker\.register\('\/sw\.js'\)/);
  assert.match(serviceWorker, /pathname\.startsWith\('\/api\/'\)/);
  assert.doesNotMatch(serviceWorker, /cache\.put\([^;]*\/api\//);
});

test('v18 theme uses preference storage without storing authentication data', () => {
  const theme = readFileSync(new URL('../src/theme/theme.ts', import.meta.url), 'utf8');
  assert.match(theme, /anivideos\.theme/);
  assert.doesNotMatch(theme, /token|session|password/i);
});
