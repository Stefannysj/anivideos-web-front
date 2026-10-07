import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLibraryResponse, parseLibraryState } from '../src/models/library.js';

const content={id:'anilist-1',source:'anilist',sourceAttribution:'AniList',externalId:'1',title:'Example',originalTitle:null,category:'anime',categoryLabel:'Anime',year:2026,score:8,maturity:'NR',format:'tv',genres:['Drama'],artwork:'https://s4.anilist.co/a.jpg',studio:null,episodes:12,status:'airing'};
test('parses v17 library entries',()=>{const items=parseLibraryResponse({items:[{content,isFavorite:true,progressStatus:'watching',updatedAt:'2026-10-07T00:00:00Z'}]});assert.equal(items[0]?.progressStatus,'watching');assert.equal(items[0]?.isFavorite,true);});
test('parses library state',()=>assert.deepEqual(parseLibraryState({contentId:'anilist-1',isFavorite:false,progressStatus:'planned'}),{contentId:'anilist-1',isFavorite:false,progressStatus:'planned'}));
