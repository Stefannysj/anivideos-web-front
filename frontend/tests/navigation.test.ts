import assert from 'node:assert/strict';
import test from 'node:test';
import { navigationItems } from '../src/models/navigation.js';

test('contains all v16 catalog categories',()=>{const hrefs=new Set(navigationItems.map(x=>x.href));for(const href of ['#anime','#k-dramas','#j-dramas','#donghua','#peliculas','#ovas'])assert.ok(hrefs.has(href as never));});
