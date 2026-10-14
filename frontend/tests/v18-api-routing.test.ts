import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveApiBaseUrl } from '../src/config/api.js';

test('local development normalizes direct loopback API URLs to the Vite proxy', () => {
  assert.equal(resolveApiBaseUrl(undefined, false), '/api');
  assert.equal(resolveApiBaseUrl('http://127.0.0.1:3001/api', false), '/api');
  assert.equal(resolveApiBaseUrl('http://localhost:3001/api', false), '/api');
});

test('production keeps HTTPS API origins and rejects insecure remote HTTP', () => {
  assert.equal(resolveApiBaseUrl('https://api.example.com/api', true), 'https://api.example.com/api');
  assert.throws(() => resolveApiBaseUrl('http://api.example.com/api', true));
});
