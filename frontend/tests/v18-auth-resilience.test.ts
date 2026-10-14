import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveApiBaseUrl } from '../src/config/api.js';

test('local API values use the Vite same-origin proxy', () => {
  assert.equal(resolveApiBaseUrl(undefined, false), '/api');
  assert.equal(resolveApiBaseUrl('http://127.0.0.1:3001/api', false), '/api');
  assert.equal(resolveApiBaseUrl('http://localhost:3001/api', false), '/api');
});
