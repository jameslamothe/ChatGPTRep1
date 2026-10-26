import test from 'node:test';
import assert from 'node:assert/strict';
import {cards} from '../src/cards.js';
import {consonantSounds} from '../src/sounds.js';
test('all 44 consonants have beginner hints and IPA',()=>{
 assert.equal(cards.length,44);
 for(const {sounds:s} of cards){assert.ok(s.initialHint);assert.ok(s.finalHint);assert.ok(s.initialIPA);assert.ok(s.finalIPA);}
});
test('unaspirated and aspirated starts stay distinct',()=>{
 for(const [unaspirated,aspirated] of [['ก','ค'],['ต','ท'],['ป','พ'],['จ','ช']]){
  assert.match(consonantSounds(unaspirated).initialHint,/no puff/);
  assert.match(consonantSounds(aspirated).initialHint,/with a puff/);
  assert.notEqual(consonantSounds(unaspirated).initial,consonantSounds(aspirated).initial);
 }
});
test('all ending stops use unreleased k, t or p, never voiced d or b',()=>{
 for(const letter of 'กขคฆ')assert.equal(consonantSounds(letter).final,'k̚');
 for(const letter of 'จชซฎฏฐฑฒดตถทธศษส')assert.equal(consonantSounds(letter).final,'t̚');
 for(const letter of 'บปพฟภ')assert.equal(consonantSounds(letter).final,'p̚');
});
test('nasal endings, glides, unused endings and exceptions',()=>{
 for(const letter of 'ญณนรลฬ')assert.equal(consonantSounds(letter).final,'n');
 assert.equal(consonantSounds('ง').final,'ŋ');
 assert.equal(consonantSounds('ม').final,'m');
 for(const letter of 'ยว')assert.equal(consonantSounds(letter).finalLabel,'Ending glide');
 for(const letter of 'ฉฌผฝหอฮ')assert.equal(consonantSounds(letter).final,null);
 assert.match(consonantSounds('ฑ').initialIPA,/sometimes \/d\//);
 assert.match(consonantSounds('อ').initialHint,/vowel carrier/);
 assert.throws(()=>consonantSounds('X'));
});
test('IPA explanations only describe symbols present on the current card',()=>{
 const s=consonantSounds('ซ');
 assert.equal(s.ipaNotes.length,1);assert.match(s.ipaNotes[0],/\/t̚\//);assert.doesNotMatch(s.ipaNotes.join(' '),/puff|ʰ/);
 const kh=consonantSounds('ค');assert.equal(kh.ipaNotes.length,2);assert.match(kh.ipaNotes[0],/puff/);assert.match(kh.ipaNotes[1],/\/k̚\//);
 assert.deepEqual(consonantSounds('ม').ipaNotes,[]);
 assert.equal(consonantSounds('ผ').ipaNotes.length,1);assert.match(consonantSounds('ผ').ipaNotes[0],/puff/);
 for(const c of cards){
  assert.equal(c.sounds.ipaNotes.some(n=>n.includes('puff')),c.sounds.initial.includes('ʰ'));
  assert.equal(c.sounds.ipaNotes.some(n=>n.includes('release')),Boolean(c.sounds.final?.includes('̚')));
 }
});
