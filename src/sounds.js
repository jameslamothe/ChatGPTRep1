// Broad Standard Thai pronunciation. English comparisons are approximations.
// Final stops are unreleased. Vowel glides are distinguished from final consonants.
const groups = [
 ['ก','k','k̚'], ['ขฃคฅฆ','kʰ','k̚'], ['ง','ŋ','ŋ'],
 ['จ','tɕ','t̚'], ['ฉฌ','tɕʰ',null], ['ช','tɕʰ','t̚'], ['ซศษส','s','t̚'],
 ['ญ','j','n'], ['ฎด','d','t̚'], ['ฏต','t','t̚'],
 ['ฐฑฒถทธ','tʰ','t̚'], ['ณน','n','n'], ['บ','b','p̚'], ['ป','p','p̚'],
 ['ผ','pʰ',null], ['ฝ','f',null], ['พภ','pʰ','p̚'], ['ฟ','f','p̚'],
 ['ม','m','m'], ['ย','j','j'], ['ร','r','n'], ['ลฬ','l','n'],
 ['ว','w','w'], ['หฮ','h',null], ['อ','ʔ',null]
];
const initialHints = {
 'k':'k as in “ski”—no puff of air',
 'kʰ':'k as in “kite”—with a puff of air',
 'ŋ':'ng as in “sing,” but at the start of the syllable',
 'tɕ':'a ch-like sound—no puff of air; not English j',
 'tɕʰ':'a ch-like sound—with a puff of air',
 's':'s as in “sun”', 'j':'y as in “yes”', 'd':'d as in “day”',
 't':'t as in “stop”—no puff of air',
 'tʰ':'t as in “top”—with a puff of air; not th in “thin”',
 'n':'n as in “no”', 'b':'b as in “bat”',
 'p':'p as in “spin”—no puff of air',
 'pʰ':'p as in “pin”—with a puff of air; not f',
 'f':'f as in “fan”', 'm':'m as in “moon”',
 'r':'r with a brief tongue-tip tap or trill', 'l':'l as in “leaf”',
 'w':'w as in “we”', 'h':'h as in “hat”',
 'ʔ':'a brief catch in the throat, as in “uh-oh”; also a vowel carrier'
};
const finalHints = {
 'k̚':'k—close the sound without releasing it',
 't̚':'t—close the sound without releasing it; not d',
 'p̚':'p—close the lips without releasing the sound; not b',
 'ŋ':'ng as in “sing”', 'n':'n as in “sun”', 'm':'m as in “sum”',
 'j':'a y-like glide, as at the end of “boy”',
 'w':'a w-like glide, as at the end of “cow”'
};
export function consonantSounds(character) {
 const group=groups.find(([letters])=>letters.includes(character));
 if(!group)throw new Error('Unknown consonant');
 const [,initial,final]=group;
 const glide=character==='ย'||character==='ว';
 const note=character==='ฑ' ? 'ฑ starts with d in some words; the usual starting sound is shown here.' :
  character==='ฃ'||character==='ฅ' ? 'Obsolete letter. These are its conventional modern sounds; you will rarely see it in words.' :
  glide ? 'This ending is part of a vowel combination, rather than a separate final consonant.' : '';
 return {initial,final,initialHint:initialHints[initial],
  finalHint:final ? finalHints[final] : 'No regular syllable-ending sound',
  finalLabel:glide?'Ending glide':'End',note,
  initialIPA:character==='ฑ'?'/tʰ/ (sometimes /d/)':`/${initial}/`,
  finalIPA:final?`/${final}/`:'Not used'};
}
