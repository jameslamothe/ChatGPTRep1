# Pronunciation and audio sourcing — phase 1

Prepared 26 October 2026; updated after network access was enabled. This is a research dossier, not an app implementation. No card data, playback controls, review schedules or saved progress were changed.

For the later all-44-letter starting-sound rollout, see [the coverage update](../starting-sounds-all-consonants.md). The counts below describe the original ten-letter sourcing phase.

## Updated result

The Slice of Thai chart and the linked CC BY-NC 3.0 US license are now accessible and inspected. See [source-findings.md](source-findings.md) for the current coverage, rights evidence and remaining gaps.

- Nine source-linked initial-sound recordings cover all ten pilot consonants; ข and ค share a sound.
- Three exact-word candidates are available: ไก่, ไข่ and จาน.
- All twelve files downloaded and decoded successfully. Original bytes, source URLs, hashes and attribution are retained under audio-candidates/ and in audio-candidates.json.
- These initial demonstrations are mid-tone consonant-plus-vowel syllables, **not full letter names**. None fills a full-name slot.
- Of the twenty originally requested name/word slots, three have source-matched candidates and seventeen remain unfilled. None has independent native-speaker listening sign-off.
- The linked consonant-shape chart supports the ten full-name phonetic sequences and tones. Native review and seven English-meaning dictionary checks remain outstanding. The current app is unchanged.

## Files

- [Content table](content-table.md): readable ten-character proposal and notation explanation.
- [Structured content draft](content-draft.json): existing IDs, names, example words, proposed phonetics and review status. Not imported into the app.
- [Audio register](audio-register.json): twenty explicitly unfilled slots, with fields for provenance, rights and pronunciation verification.
- [Source checks](source-checks.json): actual attempted URLs and access errors.
- [Recording and acceptance checklist](recording-checklist.md): exact requested utterances, source-rights checks and acceptance criteria.

## Earlier source search (historical; see updated result above)

| Source | Intended use | Observed result | Audio reuse status |
| --- | --- | --- | --- |
| [Thai Notes alphabet cards](https://thai-notes.com/games/alphabetcards.html) | Traditional names and pronunciation reference; investigate any recordings | HTTPS proxy returned 403 Forbidden | Not inspected; no reuse permission established |
| [Slice of Thai consonant sounds](https://slice-of-thai.com/consonant-sounds/) | Initial-sound/aspiration explanation and pronunciation reference | HTTPS proxy returned 403 Forbidden | Not inspected; no reuse permission established |
| [Kodthai chart](https://kodthai.com/vowels-consonants-chart/) | Cross-check letter names and examples | HTTPS proxy returned 403 Forbidden | Not inspected; no reuse permission established |
| [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Thai_pronunciation) and its file-search API | Search for recordings with file-specific authorship and explicit licenses | Both requests blocked with 403 Forbidden | No file selected; a collection's general policy is not a file license |
| [Wiktionary ไก่ entry](https://en.wiktionary.org/wiki/ไก่) | Cross-check a word's pronunciation and follow any audio file provenance | HTTPS proxy returned 403 Forbidden | No audio selected; text and audio licenses must be checked separately |

These are prospective reference/search locations, not verified sources supporting the content draft. The supplied reference sites were not treated as authorized sources of downloadable audio. Requests were attempted with the available elevated network execution route; the proxy continued to deny access. No verification or security checks were bypassed.

## Earlier access requirements (partly resolved)

Allow HTTPS access in the cloud environment's network settings to the specific research destinations: `thai-notes.com`, `slice-of-thai.com`, `kodthai.com`, `commons.wikimedia.org`, `en.wiktionary.org`, and `upload.wikimedia.org` (for candidate Wikimedia audio). These are required additions, not a replacement for existing allowed domains. Other file-specific destinations may be identified only after inspecting a real source page. No environment settings were changed during this task.

Alternatively, provide recordings with their original source pages and explicit license/permission evidence, or commission a native Thai speaker using the recording checklist and obtain written permission to host and redistribute the recordings. Supplying an audio file alone does not establish reuse rights. There is no need to provide passwords or tokens.

Slice of Thai and Creative Commons access is now resolved. Other reference-site access remains untested since the update. Continue with the missing seventeen recordings and native-speaker verification described in source-findings.md. Select accurate, clearly licensed, consistent speech before considering the male-voice preference. Use the smallest useful verified subset for a later implementation decision; do not represent unfilled audio controls as a completed pilot.

## Boundaries for later implementation

Keep all 44 cards and stable IDs. Preserve the two-new-cards-per-local-day limit, review priority and schedules, backup compatibility, pictures, optional IPA, ending-sound guidance and consonant classes. Use tap-to-play controls, no autoplay, and avoid overlapping clips. The current app has no guaranteed offline audio capability; this phase does not introduce it. Do not change the learning UI until the user authorizes implementation.
