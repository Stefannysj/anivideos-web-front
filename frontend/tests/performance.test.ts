import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { apiFetch } from '../src/services/http.js';

test('public GET requests may use HTTP cache while authenticated writes stay no-store', async (context) => {
  context.mock.method(globalThis, 'fetch', async (_url: string, options?: RequestInit) => {
    assert.equal(options?.method, 'GET');
    assert.equal(options?.credentials, 'omit');
    assert.equal(options?.cache, 'default');
    return Response.json({ items: [] });
  });
  await apiFetch('/api/catalog', { method: 'GET', credentials: 'omit', cache: 'default' });
});

test('large interaction-only UI is code-split with lazy imports', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const navbar = readFileSync(new URL('../src/components/Navbar.tsx', import.meta.url), 'utf8');
  const carousel = readFileSync(new URL('../src/components/FeaturedCarousel.tsx', import.meta.url), 'utf8');

  assert.match(app, /lazy\(async \(\) =>[\s\S]*?ContentDetailPage/);
  assert.match(navbar, /lazy\(async \(\) =>[\s\S]*?AuthModal/);
  assert.match(navbar, /lazy\(async \(\) =>[\s\S]*?ProfileModal/);
  assert.match(carousel, /lazy\(async \(\) =>[\s\S]*?BannerCommentsModal/);
});

test('below-the-fold sections opt into content visibility', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  assert.match(css, /\.catalog-explorer,[\s\S]*?content-visibility:\s*auto;/);
  assert.match(css, /contain-intrinsic-size:\s*auto\s+42rem;/);
});
