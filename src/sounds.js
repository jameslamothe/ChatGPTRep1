// Practical learner labels: start/end. Final "d" follows the requested
// spelling convention; phonetically this is unreleased /t/, not English /d/.
const groups = [
  ['ก','k','k'], ['ขฃคฅฆ','kh','k'], ['ง','ng','ng'],
  ['จ','j','d'], ['ฉฌ','ch',null], ['ช','ch','d'], ['ซศษส','s','d'],
  ['ญ','y','n'], ['ฎด','d','d'], ['ฏต','t','d'],
  ['ฐฑฒถทธ','th','d'], ['ณน','n','n'], ['บ','b','p'], ['ป','p','p'],
  ['ผ','ph',null], ['ฝ','f',null], ['พภ','ph','p'], ['ฟ','f','p'],
  ['ม','m','m'], ['ย','y','y'], ['ร','r','n'], ['ลฬ','l','n'],
  ['ว','w','w'], ['หฮ','h',null], ['อ','ʔ',null]
];
export function consonantSounds(character) {
  const group = groups.find(([letters]) => letters.includes(character));
  if (!group) throw new Error('Unknown consonant');
  const [,initial,final] = group;
  return {initial, final, label:`${initial}${final ? '/' + final : ''} sound`, note:
    character === 'อ' ? 'Start: glottal stop (a brief catch in the throat); also a vowel carrier. No regular ending sound.' :
    character === 'ฑ' ? 'Start: th (d in some words). End: d.' :
    !final ? 'Start only; no regular syllable-ending sound.' :
    character === 'ย' || character === 'ว' ? 'The ending is a glide in a vowel combination.' :
    ''};
}
