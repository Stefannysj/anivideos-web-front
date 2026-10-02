import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('responsive release removes a forced minimum page width', () => {
  assert.match(css, /html,\s*body,\s*#root,\s*\.app-shell\s*\{[\s\S]*?min-width:\s*0;/);
  assert.doesNotMatch(css, /min-width:\s*320px/);
});

test('responsive release contains tablet, phone and short-landscape breakpoints', () => {
  assert.match(css, /@media \(max-width: 56rem\)/);
  assert.match(css, /@media \(max-width: 40rem\)/);
  assert.match(css, /@media \(max-width: 25rem\)/);
  assert.match(css, /@media \(max-height: 34rem\) and \(orientation: landscape\)/);
});

test('mobile viewport opts into safe-area layout', () => {
  assert.match(html, /viewport-fit=cover/);
  assert.match(css, /safe-area-inset-top/);
  assert.match(css, /safe-area-inset-bottom/);
});

test('mobile form controls prevent automatic zoom caused by tiny input text', () => {
  assert.match(css, /\.catalog-filter-field select,[\s\S]*?\.comment-composer textarea\s*\{\s*font-size:\s*1rem;/);
});
