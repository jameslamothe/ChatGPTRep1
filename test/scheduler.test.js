import test from 'node:test';
import assert from 'node:assert/strict';
import {schedule,dueCards,DAY} from '../src/scheduler.js';
import {cards} from '../src/cards.js';
test('deck contains 44 distinct Thai consonants',()=>{assert.equal(cards.length,44);assert.equal(new Set(cards.map(c=>c.character)).size,44);});
test('new card ratings schedule the promised review intervals',()=>{const now=1000;assert.equal(schedule(null,'again',now).due,now+600000);assert.equal(schedule(null,'hard',now).due,now+DAY);assert.equal(schedule(null,'good',now).due,now+DAY);assert.equal(schedule(null,'easy',now).due,now+4*DAY);});
test('successful recall increases interval and forgetting resets it',()=>{const first=schedule(null,'good',0);const next=schedule(first,'good',DAY);assert.equal(next.interval,2.5);assert.equal(next.reviews,2);assert.equal(schedule(next,'again',0).due,600000);assert.throws(()=>schedule(null,'invalid'));});
test('review queue includes new and due cards but excludes future cards',()=>{const progress={[cards[0].id]:schedule(null,'good',0)};assert.equal(dueCards(cards,progress,0).length,43);assert.equal(dueCards(cards,progress,DAY).length,44);});
test('overdue reviews come before new cards, oldest first',()=>{
 const progress={[cards[20].id]:{interval:1,due:100,reviews:1},[cards[40].id]:{interval:1,due:50,reviews:1}};
 const queue=dueCards(cards,progress,100);
 assert.equal(queue[0].id,cards[40].id);assert.equal(queue[1].id,cards[20].id);
 assert.equal(queue[2].id,cards[0].id);
});
test('every rating stays in the future and repeated easy reviews retain usable dates',()=>{
 let previous=null;let now=Date.now();
 for(let i=0;i<100;i++){
  previous=schedule(previous,'easy',now);
  assert.ok(Number.isFinite(previous.due));assert.ok(previous.due>now);
  assert.ok(Number.isFinite(new Date(previous.due).getTime()));
 }
 assert.equal(schedule({interval:1,reviews:Number.MAX_SAFE_INTEGER},'good',now).reviews,Number.MAX_SAFE_INTEGER);
});
