# Starting-sound audio for all 44 consonants

Updated 26 October 2026. The ten-letter starting-sound pilot is now extended to the remaining 34 consonants at the user's request. This does not add example-word or full-letter-name playback.

## Source and license

All 21 unique starting-sound recordings are directly linked by [The Consonant Sounds of Thai](https://slice-of-thai.com/consonant-sounds/#chart). The page was fetched again before the twelve additional downloads, and each requested file path was checked against its actual player links. The site's audio license is [CC BY-NC 3.0 US](https://creativecommons.org/licenses/by-nc/3.0/us/), with copyright credit Chris Pirazzi / slice-of-thai.com. Original bytes are retained without modification. Per-file URLs, hashes, metadata and decoding results are in [audio-candidates.json](pronunciation-phase-1/audio-candidates.json); [attribution](pronunciation-phase-1/audio-candidates/ATTRIBUTION.md) is also shown on the cards.

The chart describes the samples as native speech in a mid-tone syllable containing /ɔː/. They demonstrate starting sounds, not the full traditional names or the consonant class's naming tone. Independent native-speaker listening sign-off and real-phone playback checks remain outstanding. No claim of speaker gender or individual identity is made.

## Mapping

| Letters | Initial IPA | Local recording |
| --- | --- | --- |
| ก | /k/ | initial-g.mp3 |
| ข ฃ ค ฅ ฆ | /kʰ/ | initial-k.mp3 |
| ง | /ŋ/ | initial-ng.mp3 |
| จ | /tɕ/ | initial-j.mp3 |
| ฉ ช ฌ | /tɕʰ/ | initial-ch.mp3 |
| ซ ศ ษ ส | /s/ | initial-s.mp3 |
| ญ ย | /j/ | initial-y.mp3 |
| ฎ ด | /d/ | initial-d.mp3 |
| ฏ ต | /t/ | initial-dt.mp3 |
| ฐ ฑ ฒ ถ ท ธ | /tʰ/ | initial-t.mp3 |
| ณ น | /n/ | initial-n.mp3 |
| บ | /b/ | initial-b.mp3 |
| ป | /p/ | initial-bp.mp3 |
| ผ พ ภ | /pʰ/ | initial-p.mp3 |
| ฝ ฟ | /f/ | initial-f.mp3 |
| ม | /m/ | initial-m.mp3 |
| ร | /r/ | initial-r.mp3 |
| ล ฬ | /l/ | initial-l.mp3 |
| ว | /w/ | initial-w.mp3 |
| ห ฮ | /h/ | initial-h.mp3 |
| อ | /ʔ/ | initial-glottal.mp3 |

Source filenames use the site's pronunciation notation; the app's phonetic mapping uses IPA. The local glottal filename corresponds to the actual linked source pc-_294_.mp3. ฑ's conventional /tʰ/ demonstration does not replace its existing note about /d/ in some words. The obsolete letters use their conventional modern starting-sound labels, not a claim about historical pronunciation.

## Behavior and validation

Controls appear only after revealing the answer, and in deck details. Playback is tap-only, limited to one clip at a time, stops on card navigation, and supports explicit stop and retry after failure. Full-name audio and example-word audio are not wired into the app. All twelve additional MP3s passed full FFmpeg decoding; all 21 starting-sound assets are checked against recorded SHA-256 hashes in the tests.

The existing card IDs, schedules, local progress format, two-new-cards-per-local-day limit, and review priority are unchanged. The three example-word files retained in the research folder remain research-only.
