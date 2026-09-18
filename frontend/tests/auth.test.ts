import assert from 'node:assert/strict';
import test from 'node:test';
import { parseAuthApiError, parseAuthResponse, validateEmail, validatePassword, validateUsername } from '../src/models/auth.js';

test('parseAuthResponse accepts a valid backend user', () => {
  const parsed = parseAuthResponse({
    user: { id: 7, username: 'stefa', email: 'stefa@example.com', avatarUrl: null, createdAt: '2026-09-17T10:00:00Z' },
  });
  assert.equal(parsed.user.username, 'stefa');
});

test('registration validation mirrors essential backend constraints', () => {
  assert.equal(validateUsername('stefa_01'), null);
  assert.ok(validateUsername('a'));
  assert.equal(validateEmail('stefa@example.com'), null);
  assert.ok(validateEmail('invalid'));
  assert.equal(validatePassword('AniVideos2026'), null);
  assert.ok(validatePassword('short1'));
});

test('parseAuthApiError extracts safe backend message', () => {
  const parsed = parseAuthApiError({ error: { code: 'VALIDATION_ERROR', message: 'Revisa los datos enviados.' } }, 'fallback');
  assert.equal(parsed.code, 'VALIDATION_ERROR');
  assert.equal(parsed.message, 'Revisa los datos enviados.');
});
