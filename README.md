# Little Thai

A small Thai consonant flashcard app with spaced repetition. Includes 44 consonants, letter names, rough English transliterations, meanings, and consonant classes. The two obsolete consonants are marked. Transliterations are learning aids with spoken-tone marks (ā mid, à low, â falling, á high, ǎ rising); these marks do not show vowel length. Hyphens separate syllables in a word. Audio is not included.

## Run

Requires Node.js 20 or newer. No package installation or API keys are needed.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Run checks with `npm test`.

## Learning

Begin with each character’s name and starting sound, reveal the answer, and rate your recall. Add ending sounds and consonant classes gradually. Each answer has separate start/end hints and an expandable IPA guide. English comparisons are approximate; the IPA represents broad Standard Thai sounds. Ending stops are unreleased, and ย/ว ending glides are identified separately. Silent spellings and word-specific exceptions still require learning the whole word. Again returns in 10 minutes; Hard starts at one day and grows by 1.2×; Good starts at one day and grows by 2.5×; Easy starts at four days and grows by 3.5×. This is a simple interval scheduler, not a clinical or statistical retention model. Due dates use elapsed time, rather than midnight boundaries.

Progress lives in localStorage in the current browser and site origin. Export a JSON backup before clearing browser data or moving devices; importing replaces current progress after confirmation. There is no account or automatic cloud sync. Explore the deck without changing review schedules.

The app uses a system font fallback if Google Fonts is unavailable.
