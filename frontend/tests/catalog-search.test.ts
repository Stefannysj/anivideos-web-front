import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCatalogQuery, defaultCatalogFilters } from '../src/models/catalog-filters.js';

test('serializes status and format filters',()=>{const query=buildCatalogQuery({...defaultCatalogFilters,category:'donghua',status:'airing',format:'tv'});const p=new URLSearchParams(query);assert.equal(p.get('category'),'donghua');assert.equal(p.get('status'),'airing');assert.equal(p.get('format'),'tv');});
