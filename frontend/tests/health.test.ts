import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveApiBaseUrl } from '../src/config/api.js';
import { parseHealthResponse } from '../src/models/health.js';
import { getHealth } from '../src/services/health.service.js';

test('acepta exclusivamente el contrato de salud esperado', () => {
  assert.deepEqual(parseHealthResponse({ status: 'ok', service: 'anivideos-api' }), {
    status: 'ok', service: 'anivideos-api',
  });
  for (const invalid of [null, [], 'ok', {}, { status: 'ok' }, { status: 'error', service: 'anivideos-api' }]) {
    assert.throws(() => parseHealthResponse(invalid));
  }
});

test('no conserva campos inesperados recibidos de la API', () => {
  assert.deepEqual(parseHealthResponse({ status: 'ok', service: 'anivideos-api', secret: 'hidden' }), {
    status: 'ok', service: 'anivideos-api',
  });
});

test('la configuracion predeterminada usa el proxy relativo', () => {
  assert.equal(resolveApiBaseUrl(undefined, false), '/api');
  assert.equal(resolveApiBaseUrl('', true), '/api');
});

test('admite API HTTPS y elimina la barra final', () => {
  assert.equal(resolveApiBaseUrl('https://api.example.com/api/', true), 'https://api.example.com/api');
});

test('HTTP solo esta permitido para desarrollo local', () => {
  assert.equal(resolveApiBaseUrl('http://127.0.0.1:3001/api', false), 'http://127.0.0.1:3001/api');
  assert.throws(() => resolveApiBaseUrl('http://127.0.0.1:3001/api', true));
  assert.throws(() => resolveApiBaseUrl('http://example.com/api', false));
});

test('rechaza credenciales, protocolos peligrosos y parametros', () => {
  for (const value of ['javascript:alert(1)', '//evil.example/api', 'https://user:password@example.com/api',
    'https://example.com/api?key=secret', 'https://example.com/api#fragment']) {
    assert.throws(() => resolveApiBaseUrl(value, true));
  }
});

test('el servicio consulta /health y valida los datos', async (context) => {
  context.mock.method(globalThis, 'fetch', async (url: string) => {
    assert.equal(url, '/api/health');
    return Response.json({ status: 'ok', service: 'anivideos-api' });
  });
  assert.equal((await getHealth('/api')).status, 'ok');
});

test('el servicio no muestra el mensaje interno de un error HTTP', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => new Response('database-password', { status: 500 }));
  await assert.rejects(getHealth('/api'), { message: 'No fue posible consultar el backend.' });
});

test('el servicio rechaza respuestas no compatibles', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => Response.json({ status: 'wrong' }));
  await assert.rejects(getHealth('/api'), { message: 'La API devolvio una respuesta inesperada.' });
});

test('el servicio rechaza JSON invalido', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => new Response('<html>error</html>'));
  await assert.rejects(getHealth('/api'));
});

test('propaga la cancelacion externa', async (context) => {
  const controller = new AbortController();
  controller.abort();
  context.mock.method(globalThis, 'fetch', async (_url: string, options: RequestInit) => {
    assert.equal(options.signal?.aborted, true);
    throw new DOMException('Aborted', 'AbortError');
  });
  await assert.rejects(getHealth('/api', controller.signal), { name: 'AbortError' });
});
