import assert from 'node:assert/strict';
import test from 'node:test';
import { profileInitials, validateProfile } from '../src/models/profile.js';

test('profileInitials uses visible name when available', () => {
  assert.equal(profileInitials('Stefanny Roman', 'stefanny'), 'SR');
  assert.equal(profileInitials(null, 'stefanny'), 'ST');
});

test('validateProfile requires password when identity changes', () => {
  const errors = validateProfile({
    username: 'stefanny',
    email: 'stefanny@example.com',
    displayName: 'Stefanny',
    bio: 'Anime fan',
    currentPassword: '',
    identityChanged: true,
  });
  assert.ok(errors.currentPassword);
});

test('validateProfile accepts ordinary profile-only edits', () => {
  const errors = validateProfile({
    username: 'stefanny',
    email: 'stefanny@example.com',
    displayName: 'Stefanny',
    bio: 'Anime, series y películas.',
    currentPassword: '',
    identityChanged: false,
  });
  assert.deepEqual(errors, {});
});
