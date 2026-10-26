import test from 'node:test';
import assert from 'node:assert/strict';
import {cards} from '../src/cards.js';
import {illustrations} from '../src/illustrations.js';
test('stable card IDs preserve existing saved progress',()=>{
 const order='กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ';
 assert.equal(cards.map(c=>c.character).join(''),order);
 cards.forEach((c,i)=>assert.equal(c.id,`thai-${i}`));
});
test('consonant classes follow the 9 mid, 11 high and 24 low groups',()=>{
 const mid='กจฎฏดตบปอ',high='ขฃฉฐถผฝศษสห';
 for(const c of cards)assert.equal(c.group,mid.includes(c.character)?'Mid':high.includes(c.character)?'High':'Low');
 assert.equal(cards.filter(c=>c.group==='Low').length,24);
});
test('every card has a unique illustration viewport inside the uploaded sheet',()=>{
 assert.equal(Object.keys(illustrations).length,44);
 const boxes=new Set();
 for(const c of cards){
  const {box:[x,y,w,h],outline}=illustrations[c.character];
  assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1448&&y+h<=1086);
  assert.ok(outline.length>0);boxes.add(`${x},${y},${w},${h}`);
 }
 assert.equal(boxes.size,44);
});
