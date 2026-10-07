import assert from 'node:assert/strict';
import test from 'node:test';
import { parseContentDetailResponse } from '../src/models/content.js';

test('allows official youtube trailer and platform links',()=>{const item=parseContentDetailResponse({id:'tmdb-tv-1',source:'tmdb',sourceAttribution:'TMDB',externalId:'tv:1',title:'Drama',originalTitle:null,category:'k-drama',categoryLabel:'K-Drama',year:2026,score:8,maturity:'NR',format:'tv',genres:['Drama'],artwork:'https://image.tmdb.org/t/p/w780/a.jpg',studio:'Network',episodes:16,status:'airing',synopsis:'Synopsis',origin:'KR',backdropUrl:'https://image.tmdb.org/t/p/w1280/b.jpg',trailerYoutubeId:'abcDEF_1234',officialUrl:'https://example.com',platformLinks:[{name:'Netflix',url:'https://example.com/watch'}],sourceUrl:'https://www.themoviedb.org/tv/1'});assert.equal(item.platformLinks[0]?.name,'Netflix');});
