# Slice of Thai source findings

Checked 26 October 2026, after the user published the targeted network changes. This updates, rather than erases, the earlier blocked-source research.

## What has now been established

1. [The Consonant Sounds of Thai](https://slice-of-thai.com/consonant-sounds/#chart) is accessible. Its copyright notice credits Chris Pirazzi and explicitly links audio to [CC BY-NC 3.0 US](https://creativecommons.org/licenses/by-nc/3.0/us/). The linked license deed was inspected successfully. Text, PDFs and images are separately restricted; they have not been copied into this repository.
2. The chart describes its sound demonstrations as a native speaker pronouncing a consonant in a **mid-tone syllable with /ɔː/**. These recordings are not the full traditional letter names and must not be labeled as such. In particular, the same /kʰɔː/ demonstration can illustrate the initial sound of ข and ค, but does not teach the rising-tone letter name ขอ.
3. Nine distinct chart recordings cover the ten target consonants. ข and ค share their initial-sound demonstration because they have the same initial phoneme, despite different consonant classes.
4. The page explicitly provides the exact example words ไก่ (chicken), ไข่ (egg), and จาน (plate), with IPA and recording links. These match the draft's words and tone distinctions.
5. The three exact words plus nine initial demonstrations were downloaded from links actually present in the page. All twelve HTTP downloads succeeded and all twelve files passed FFprobe and full FFmpeg decode checks. Originals are preserved, with SHA-256 hashes and per-file URLs in audio-candidates.json. Durations are approximately 0.94–1.18 seconds. Sample peaks were below full scale; this does not prove no clipping in the original recording. Mean levels differ, so listening/level matching is still needed.
6. No named speaker, verified male voice, independent listening assessment or native-review sign-off has been established. Source-described native speech and file decodability must not be conflated with independent pronunciation approval.

## Coverage

| Character | Initial demonstration candidate | Full letter-name recording | Exact mnemonic-word candidate |
| --- | --- | --- | --- |
| ก | initial-g | Not found on inspected page | ไก่ — word-kai |
| ข | initial-k | Not found on inspected page | ไข่ — word-khai |
| ค | initial-k (same initial sound as ข) | Not found on inspected page | ควาย — still needed |
| ง | initial-ng | Not found on inspected page | งู — still needed |
| จ | initial-j | Not found on inspected page | จาน — word-chan |
| ช | initial-ch | Not found on inspected page | ช้าง — still needed |
| ด | initial-d | Not found on inspected page | เด็ก — still needed |
| ต | initial-dt | Not found on inspected page | เต่า — still needed |
| บ | initial-b | Not found on inspected page | ใบไม้ — still needed |
| ป | initial-bp | Not found on inspected page | ปลา — still needed |

“Not found on inspected page” does not claim that no such recording exists elsewhere on the site or on other sites. No speculative or guessed audio paths were used.

The page's ชาน example means “platform,” not ช้าง (“elephant”). It must not be substituted into the ช้าง slot. The page also contains deliberately altered or incorrect pronunciation demonstrations (including dropped-cluster examples); do not select those merely because they resemble a target word's filename.

## Content verification and remaining gaps

The source supports the pilot's initial phoneme distinctions: ก /k/ versus ข/ค /kʰ/, จ /tɕ/ versus ช /tɕʰ/, ด /d/ versus ต /t/, บ /b/ versus ป /p/, and initial ง /ŋ/. Its dedicated explanations emphasize that English spelling equivalents are approximate and describe unreleased final stops. The app's current learner hints are consistent with those contrasts. No app data was changed.

The sound page alone does not cover full letter names. Following the site’s language index led to the [consonant-shape chart](https://slice-of-thai.com/consonant-shape/), whose name transcriptions support the full-name phonetic sequences and tones of all ten pilot entries, including the mnemonic-word pronunciation. The linked [flashcard page](https://slice-of-thai.com/flashcards/) describes printable material. Neither additional page contains MP3 links in the inspected HTML. Seven existing English mnemonic meanings have not been independently dictionary-checked in this task. All content still awaits native-speaker review. The full pilot still needs ten full-name recordings and seven additional exact-word recordings, plus native-speaker review of all selected material.

Outside the pilot, the chart explicitly excludes ฃ and ฅ from syllable-final use, whereas the current app groups their conventional ending sound with /k̚/. Flag this for a separate correction/review of the obsolete letters; no unrelated app change was made during sourcing.

## Recommended next decision

For a smaller sound-learning pilot, these nine shared initial demonstrations could support all ten cards after listening checks, provided they are labeled “Starting-sound example,” not “Letter name.” That is a scope change requiring a later implementation decision.

For the originally proposed two-button pilot, continue sourcing the seventeen missing recordings or commission the exact scripts in recording-checklist.md. Do not treat twelve downloaded files as completion of twenty requested name/word slots.

A later noncommercial deployment must include attribution, source links and the exact license link, identify any adaptations, and keep this audio separate from any software-license grant. Do not assume permission for commercial reuse. No playback components were implemented in this research step.
