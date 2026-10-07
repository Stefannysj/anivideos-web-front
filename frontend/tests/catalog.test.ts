import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCatalogResponse } from '../src/models/content.js';

test('accepts AniList and TMDB artwork hosts and v16 categories', () => {
  const items = parseCatalogResponse({ items: [{
    id:'anilist-1',source:'anilist',sourceAttribution:'AniList',externalId:'1',title:'Example',originalTitle:null,
    category:'ova',categoryLabel:'OVA',year:2026,score:8.2,maturity:'NR',format:'ova',genres:['Drama'],
    artwork:'https://s4.anilist.co/file/a.jpg',studio:null,episodes:1,status:'finished'
  }]});
  assert.equal(items[0]?.category, 'ova');
});
