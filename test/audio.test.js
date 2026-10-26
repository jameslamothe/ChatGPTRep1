import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {startingAudio,createAudioPlayer} from '../src/audio.js';

class FakeAudio extends EventTarget {
 currentTime=0;paused=false;
 constructor(url,play){super();this.url=url;this.start=play;}
 play(){return this.start?.()||Promise.resolve();}
 pause(){this.paused=true;}
}
test('all 44 consonants share 21 original starting-sound files',async()=>{
 assert.deepEqual(Object.keys(startingAudio).sort(),[...'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'].sort());
 assert.equal(startingAudio['ข'].url,startingAudio['ค'].url);
 assert.equal(startingAudio['ผ'].url,startingAudio['ภ'].url);
 assert.match(startingAudio['อ'].url,/initial-glottal\.mp3$/);
 assert.match(startingAudio['ร'].url,/initial-r\.mp3$/);
 assert.equal(new Set(Object.values(startingAudio).map(a=>a.url)).size,21);
 const manifest=JSON.parse(await readFile(new URL('../research/pronunciation-phase-1/audio-candidates.json',import.meta.url)));
 for(const a of Object.values(startingAudio)){
  assert.match(a.url,/initial-[a-z]+\.mp3$/);
  const original=manifest.find(m=>m.sourceUrl===a.source);
  assert.ok(original);
  assert.equal(createHash('sha256').update(await readFile(new URL(a.url))).digest('hex'),original.sha256);
 }
});
test('new playback stops the previous clip and ignores its late events',async()=>{
 const sounds=[],states=[];
 const player=createAudioPlayer(url=>{const a=new FakeAudio(url);sounds.push(a);return a;});
 await player.play('one',s=>states.push('one:'+s));
 sounds[0].currentTime=.5;
 await player.play('two',s=>states.push('two:'+s));
 assert.equal(sounds[0].paused,true);assert.equal(sounds[0].currentTime,0);
 const length=states.length;
 sounds[0].dispatchEvent(new Event('playing'));sounds[0].dispatchEvent(new Event('error'));
 assert.equal(states.length,length);
 sounds[1].dispatchEvent(new Event('playing'));assert.equal(states.at(-1),'two:playing');
});
test('stop cancels playback and resets the UI',async()=>{
 let audio;const states=[];const p=createAudioPlayer(url=>audio=new FakeAudio(url));
 await p.play('one',s=>states.push(s));p.stop();
 assert.equal(audio.paused,true);assert.equal(states.at(-1),'idle');
 audio.dispatchEvent(new Event('playing'));assert.equal(states.at(-1),'idle');
});
test('failed or missing audio produces a recoverable error',async()=>{
 let audio;const states=[];const p=createAudioPlayer(url=>audio=new FakeAudio(url,()=>Promise.reject(new Error('Denied'))));
 await p.play('one',(s,msg)=>states.push([s,msg]));
 assert.equal(states.at(-1)[0],'error');assert.match(states.at(-1)[1],/retry/);
 const q=createAudioPlayer(url=>audio=new FakeAudio(url));
 await q.play('missing',(s,msg)=>states.push([s,msg]));audio.dispatchEvent(new Event('error'));
 assert.equal(states.at(-1)[0],'error');assert.match(states.at(-1)[1],/connection/);
});
test('a late play rejection after stop cannot alter the next card',async()=>{
 let reject;const states=[];
 const p=createAudioPlayer(url=>new FakeAudio(url,()=>new Promise((resolve,no)=>{reject=no;})));
 const playing=p.play('one',s=>states.push(s));p.stop();
 reject(new Error('Cancelled'));await playing;assert.deepEqual(states,['loading','idle']);
});
test('ending restores the play control without looping',async()=>{
 let audio;const states=[];const p=createAudioPlayer(url=>audio=new FakeAudio(url));
 await p.play('one',s=>states.push(s));audio.dispatchEvent(new Event('ended'));
 assert.equal(states.at(-1),'idle');assert.equal(audio.paused,true);
});
