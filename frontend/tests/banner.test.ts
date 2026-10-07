import assert from 'node:assert/strict';
import test from 'node:test';
import { parseBannerResponse, wrapBannerIndex } from '../src/models/banner.js';

test('parses real provider banner',()=>{const items=parseBannerResponse({items:[{id:'featured-anilist-1',contentId:'anilist-1',source:'anilist',sourceAttribution:'AniList',category:'Anime',eyebrow:'Anime destacado',title:'Example',synopsis:'Text',year:2026,ageRating:'NR',format:'tv',genres:['Drama'],artwork:'https://s4.anilist.co/file/banner.jpg',sectionHref:'#anime'}]});assert.equal(items[0]?.contentId,'anilist-1');});
test('wraps indexes',()=>assert.equal(wrapBannerIndex(0,-1,4),3));
