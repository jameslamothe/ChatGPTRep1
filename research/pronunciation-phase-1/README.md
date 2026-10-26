# Pronunciation and audio sourcing — phase 1

Prepared 26 October 2026. This is a research dossier, not an app implementation. No card data, playback controls, review schedules or saved progress were changed.

## Result

- Ten pilot characters have draft content and a recording script: ก ข ค ง จ ช ด ต บ ป.
- Twenty separate recording slots are identified: a full letter name and a mnemonic example word for each character.
- **Zero verified recordings, zero downloaded audio files, and zero confirmed audio reuse licenses.** All twenty slots remain unfilled. No filename or asset path represents a recording that does not exist.
- External pronunciation and licensing verification is blocked by network access restrictions. Do not interpret that as evidence that suitable recordings do not exist.
- A speaker's native status, gender, pronunciation quality and consistency have not been confirmed. No human reviewer is attributed to the draft.

## Files

- [Content table](content-table.md): readable ten-character proposal and notation explanation.
- [Structured content draft](content-draft.json): existing IDs, names, example words, proposed phonetics and review status. Not imported into the app.
- [Audio register](audio-register.json): twenty explicitly unfilled slots, with fields for provenance, rights and pronunciation verification.
- [Source checks](source-checks.json): actual attempted URLs and access errors.
- [Recording and acceptance checklist](recording-checklist.md): exact requested utterances, source-rights checks and acceptance criteria.

## Source search and verification status

| Source | Intended use | Observed result | Audio reuse status |
| --- | --- | --- | --- |
| [Thai Notes alphabet cards](https://thai-notes.com/games/alphabetcards.html) | Traditional names and pronunciation reference; investigate any recordings | HTTPS proxy returned 403 Forbidden | Not inspected; no reuse permission established |
| [Slice of Thai consonant sounds](https://slice-of-thai.com/consonant-sounds/) | Initial-sound/aspiration explanation and pronunciation reference | HTTPS proxy returned 403 Forbidden | Not inspected; no reuse permission established |
| [Kodthai chart](https://kodthai.com/vowels-consonants-chart/) | Cross-check letter names and examples | HTTPS proxy returned 403 Forbidden | Not inspected; no reuse permission established |
| [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Thai_pronunciation) and its file-search API | Search for recordings with file-specific authorship and explicit licenses | Both requests blocked with 403 Forbidden | No file selected; a collection's general policy is not a file license |
| [Wiktionary ไก่ entry](https://en.wiktionary.org/wiki/ไก่) | Cross-check a word's pronunciation and follow any audio file provenance | HTTPS proxy returned 403 Forbidden | No audio selected; text and audio licenses must be checked separately |

These are prospective reference/search locations, not verified sources supporting the content draft. The supplied reference sites were not treated as authorized sources of downloadable audio. Requests were attempted with the available elevated network execution route; the proxy continued to deny access. No verification or security checks were bypassed.

## What is needed to finish this sourcing step

Allow HTTPS access in the cloud environment's network settings to the specific research destinations: `thai-notes.com`, `slice-of-thai.com`, `kodthai.com`, `commons.wikimedia.org`, `en.wiktionary.org`, and `upload.wikimedia.org` (for candidate Wikimedia audio). These are required additions, not a replacement for existing allowed domains. Other file-specific destinations may be identified only after inspecting a real source page. No environment settings were changed during this task.

Alternatively, provide recordings with their original source pages and explicit license/permission evidence, or commission a native Thai speaker using the recording checklist and obtain written permission to host and redistribute the recordings. Supplying an audio file alone does not establish reuse rights. There is no need to provide passwords or tokens.

Once access or documented recordings are available, inspect actual candidates, fill the twenty-slot register with genuine source and license evidence, and obtain native-speaker verification. Select accurate, clearly licensed, consistent speech before considering the male-voice preference. Use the smallest useful verified subset for a later implementation decision; do not represent unfilled audio controls as a completed pilot.

## Boundaries for later implementation

Keep all 44 cards and stable IDs. Preserve the two-new-cards-per-local-day limit, review priority and schedules, backup compatibility, pictures, optional IPA, ending-sound guidance and consonant classes. Use tap-to-play controls, no autoplay, and avoid overlapping clips. The current app has no guaranteed offline audio capability; this phase does not introduce it. Do not change the learning UI until the user authorizes implementation.
