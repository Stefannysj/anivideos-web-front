import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { apiFetch, captureSecurityHeaders, clearCsrfToken, readJson } from '../src/services/http.js';

const CSRF = 'a'.repeat(64);

test('authenticated writes attach the in-memory CSRF token and strict fetch policy', async (context) => {
  clearCsrfToken();
  captureSecurityHeaders(new Response(null, { headers: { 'X-CSRF-Token': CSRF } }));

  context.mock.method(globalThis, 'fetch', async (url: string, options?: RequestInit) => {
    assert.equal(url, '/api/profile');
    assert.equal(options?.method, 'PATCH');
    assert.equal(options?.credentials, 'include');
    assert.equal(options?.cache, 'no-store');
    assert.equal(options?.redirect, 'error');
    assert.equal(options?.referrerPolicy, 'same-origin');
    assert.equal(new Headers(options?.headers).get('X-CSRF-Token'), CSRF);
    return Response.json({ ok: true });
  });

  await apiFetch('/api/profile', { method: 'PATCH', body: '{}' });
  clearCsrfToken();
});

test('public requests can explicitly omit credentials', async (context) => {
  clearCsrfToken();
  context.mock.method(globalThis, 'fetch', async (_url: string, options?: RequestInit) => {
    assert.equal(options?.credentials, 'omit');
    assert.equal(new Headers(options?.headers).has('X-CSRF-Token'), false);
    return Response.json({ status: 'ok' });
  });
  await apiFetch('/api/health', { method: 'GET', credentials: 'omit' });
});

test('JSON reader rejects an unexpected HTML response', async () => {
  await assert.rejects(
    readJson(new Response('<html>error</html>', { headers: { 'Content-Type': 'text/html' } })),
    /formato de respuesta inesperado/,
  );
});

test('React source does not opt out of HTML escaping or persist session credentials', () => {
  const sourceRoot = join(process.cwd(), 'src');
  const files = readdirSync(sourceRoot, { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string' && /\.(ts|tsx)$/.test(entry));
  const source = files.map((entry) => readFileSync(join(sourceRoot, entry), 'utf8')).join('\n');

  assert.equal(source.includes('dangerouslySetInnerHTML'), false);
  assert.equal(source.includes('.innerHTML ='), false);
  assert.equal(source.includes('localStorage.setItem'), false);
  assert.equal(source.includes('sessionStorage.setItem'), false);
});
