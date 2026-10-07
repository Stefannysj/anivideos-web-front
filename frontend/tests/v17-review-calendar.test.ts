import assert from 'node:assert/strict';
import test from 'node:test';
import { parseReviewList } from '../src/models/review.js';
import { parseSeasonCalendar, parseWeeklyCalendar } from '../src/models/calendar.js';

const content={id:'anilist-1',source:'anilist',sourceAttribution:'AniList',externalId:'1',title:'Example',originalTitle:null,category:'anime',categoryLabel:'Anime',year:2026,score:8,maturity:'NR',format:'tv',genres:['Drama'],artwork:'https://s4.anilist.co/a.jpg',studio:null,episodes:12,status:'airing'};
test('parses review summary',()=>{const result=parseReviewList({items:[{id:1,contentId:'anilist-1',rating:9,body:'Bien',author:{username:'user',displayName:null},createdAt:'x',updatedAt:'x',isOwner:true}],count:1,averageRating:9});assert.equal(result.averageRating,9);});
test('parses weekly calendar',()=>{const result=parseWeeklyCalendar({weekStart:'2026-10-05',items:[{content,airingAt:'2026-10-07T12:00:00Z',episodeNumber:7}]});assert.equal(result.items[0]?.episodeNumber,7);});
test('parses season calendar',()=>{const result=parseSeasonCalendar({season:'fall',year:2026,items:[content]});assert.equal(result.items.length,1);});
