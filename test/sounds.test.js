import test from 'node:test';
import assert from 'node:assert/strict';
import {cards} from '../src/cards.js';
import {consonantSounds} from '../src/sounds.js';
test('every consonant has an initial sound and explicit final applicability',()=>{
 assert.equal(cards.length,44);
 for(const c of cards){assert.ok(c.sounds.initial);assert.ok(c.sounds.final===null || typeof c.sounds.final==='string');}
});
test('requested sound labels and representative final changes',()=>{
 for(const [letter,label] of [['ค','kh/k sound'],['ช','ch/d sound'],['ร','r/n sound'],['ฟ','f/p sound'],['ง','ng/ng sound']]) assert.equal(consonantSounds(letter).label,label);
});
test('letters without regular final sounds are marked as such',()=>{
 for(const letter of 'ฉฌผฝหอฮ')assert.equal(consonantSounds(letter).final,null);
 assert.match(consonantSounds('อ').note,/glottal stop/);
 assert.match(consonantSounds('ฑ').note,/d in some words/);
});
