import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgressStore, validProgress, STORAGE_KEY, MAX_DATE} from '../src/progress.js';
import {DAY} from '../src/scheduler.js';
const ids=['thai-0','thai-1'];
const entry={interval:1,due:DAY,reviews:1,lastRating:'good'};
function memory(raw=null) {
 return {raw, getItem(){return this.raw;},setItem(key,value){assert.equal(key,STORAGE_KEY);this.raw=value;}};
}
test('legacy backups remain compatible and restore exactly',()=>{
 const data={'thai-0':{interval:1,due:DAY,reviews:1}};
 assert.ok(validProgress(data,ids));
 const storage=memory(JSON.stringify(data));
 const store=createProgressStore(storage,ids);
 assert.deepEqual(store.data,data);
 assert.ok(store.replace({'thai-1':entry}));
 assert.deepEqual(createProgressStore(storage,ids).data,{'thai-1':entry});
});
test('reject malformed or unusable backup entries',()=>{
 for(const data of [null,[],{'unknown':entry},{'thai-0':null},{'thai-0':[]},
  ...[{due:MAX_DATE+1},{due:-1},{interval:Infinity},{interval:0},{reviews:1.5},{reviews:1e30},{lastRating:'bad'}].map(p=>({'thai-0':{...entry,...p}}))]){
  assert.equal(validProgress(data,ids),false,JSON.stringify(data));
 }
});
test('corrupt saved work is never overwritten by practice',()=>{
 for(const raw of ['{bad json',JSON.stringify({'unknown':entry})]){
  const storage=memory(raw),store=createProgressStore(storage,ids);
  assert.equal(store.issue,'corrupt');store.rate('thai-0','good',0);
  assert.equal(storage.raw,raw);assert.equal(store.data['thai-0'].reviews,1);
  assert.ok(store.replace({'thai-1':entry}));
  assert.equal(store.issue,null);assert.deepEqual(JSON.parse(storage.raw),{'thai-1':entry});
 }
});
test('sequential writes from two tabs preserve both cards and use latest review state',()=>{
 const storage=memory(),a=createProgressStore(storage,ids),b=createProgressStore(storage,ids);
 a.rate('thai-0','good',0);b.rate('thai-1','easy',0);a.rate('thai-1','good',DAY);
 const data=JSON.parse(storage.raw);
 assert.equal(data['thai-0'].reviews,1);assert.equal(data['thai-1'].reviews,2);
 assert.equal(data['thai-1'].interval,10);
});
test('storage errors keep all session progress, and saving can recover',()=>{
 const storage=memory();let fail=true;
 const original=storage.setItem;
 storage.setItem=function(...args){if(fail)throw new Error('Quota');original.apply(this,args);};
 const store=createProgressStore(storage,ids);
 store.rate('thai-0','good',0);store.rate('thai-1','good',0);
 assert.equal(Object.keys(store.data).length,2);assert.equal(store.issue,'unavailable');
 fail=false;store.rate('thai-0','good',DAY);
 assert.equal(store.issue,null);assert.equal(Object.keys(JSON.parse(storage.raw)).length,2);
});
test('unavailable reads do not crash and failed imports stay available in memory',()=>{
 const storage={getItem(){throw new Error('Denied');},setItem(){throw new Error('Denied');}};
 const store=createProgressStore(storage,ids);
 assert.equal(store.issue,'unavailable');assert.equal(store.replace({'thai-0':entry}),false);
 store.rate('thai-1','good',0);assert.equal(Object.keys(store.data).length,2);
});
test('extra backup fields are not retained in exports',()=>{
 const storage=memory();const store=createProgressStore(storage,ids);
 store.replace({'thai-0':{...entry,html:'<script>bad</script>'}});
 assert.deepEqual(store.data,{'thai-0':entry});
});
test('a read failure cannot overwrite existing progress even if writes are allowed',()=>{
 let writes=0;
 const store=createProgressStore({getItem(){throw new Error('Read failure');},setItem(){writes++;}},ids);
 store.rate('thai-0','good',0);assert.equal(writes,0);assert.equal(store.issue,'unavailable');
});
test('introduction dates survive backup, reload and repeated reviews',()=>{
 const storage=memory(),store=createProgressStore(storage,ids),now=Date.now();
 store.rate('thai-0','again',now);store.rate('thai-0','good',now+600000);
 assert.equal(createProgressStore(storage,ids).data['thai-0'].introducedAt,now);
 assert.equal(validProgress({'thai-0':{...entry,introducedAt:-1}},ids),false);
});
test('a stale tab cannot introduce a third new card after two were saved',()=>{
 const allIds=[...ids,'thai-2'],storage=memory(),a=createProgressStore(storage,allIds),b=createProgressStore(storage,allIds);
 const now=new Date(2026,9,26,12).getTime();
 a.rate('thai-0','good',now);a.rate('thai-1','good',now);
 assert.throws(()=>b.rate('thai-2','good',now),/Daily new-card limit/);
 assert.equal(JSON.parse(storage.raw)['thai-2'],undefined);
});
