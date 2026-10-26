import test from 'node:test';
import assert from 'node:assert/strict';
import {schedule,dueCards,DAY} from '../src/scheduler.js';
import {cards} from '../src/cards.js';
test('deck contains 44 distinct Thai consonants',()=>{assert.equal(cards.length,44);assert.equal(new Set(cards.map(c=>c.character)).size,44);});
test('new card ratings schedule the promised review intervals',()=>{const now=1000;assert.equal(schedule(null,'again',now).due,now+600000);assert.equal(schedule(null,'hard',now).due,now+DAY);assert.equal(schedule(null,'good',now).due,now+DAY);assert.equal(schedule(null,'easy',now).due,now+4*DAY);});
test('successful recall increases interval and forgetting resets it',()=>{const first=schedule(null,'good',0);const next=schedule(first,'good',DAY);assert.equal(next.interval,2.5);assert.equal(next.reviews,2);assert.equal(schedule(next,'again',0).due,600000);assert.throws(()=>schedule(null,'invalid'));});
test('review queue includes new and due cards but excludes future cards',()=>{const progress={[cards[0].id]:schedule(null,'good',0)};assert.equal(dueCards(cards,progress,0).length,43);assert.equal(dueCards(cards,progress,DAY).length,44);});
