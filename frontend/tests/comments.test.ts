import assert from 'node:assert/strict';
import test from 'node:test';
import { parseBannerComment, parseBannerCommentList, validateCommentBody } from '../src/models/comment.js';

const comment = {
  id: 4,
  bannerId: 'stellar-pulse',
  body: 'Gran destacado.',
  author: { username: 'stefa', displayName: 'Stefa' },
  createdAt: '2026-09-29T15:00:00Z',
  isOwner: true,
};

test('parseBannerComment accepts the public comment contract', () => {
  assert.deepEqual(parseBannerComment(comment), comment);
  assert.equal(parseBannerCommentList({ items: [comment] }).length, 1);
});

test('comment parser rejects malformed ownership and body data', () => {
  assert.throws(() => parseBannerComment({ ...comment, isOwner: 'yes' }));
  assert.throws(() => parseBannerComment({ ...comment, body: '' }));
});

test('comment validation mirrors backend length rules', () => {
  assert.equal(validateCommentBody('Comentario válido'), null);
  assert.ok(validateCommentBody('   '));
  assert.ok(validateCommentBody('x'.repeat(1001)));
});
