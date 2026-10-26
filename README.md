# Little Thai

A small Thai consonant flashcard app with spaced repetition. Includes 44 consonants, letter names, rough English transliterations, meanings, and consonant classes. The two obsolete consonants are marked. Transliterations are learning aids with spoken-tone marks (ā mid, à low, â falling, á high, ǎ rising); these marks do not show vowel length. Hyphens separate syllables in a word. Tap-to-play starting-sound recordings are available for all 44 consonants. They demonstrate a mid-tone syllable with a long /ɔː/ vowel, not the full letter name. No example-word playback is included.

## Run

Use Node.js 24 LTS (minimum 22.8 for the test runner). Running the app requires no package installation or API keys.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Run the dependency-free checks with `npm test`.

## Learning

Begin with each character’s name and starting sound, reveal the answer, and rate your recall. Add ending sounds and consonant classes gradually. Each answer has separate start/end hints and an expandable IPA guide. English comparisons are approximate; the IPA represents broad Standard Thai sounds. Ending stops are unreleased, and ย/ว ending glides are identified separately. Silent spellings and word-specific exceptions still require learning the whole word. Again returns in 10 minutes; Hard starts at one day and grows by 1.2×; Good starts at one day and grows by 2.5×; Easy starts at four days and grows by 3.5×. This is a simple interval scheduler, not a clinical or statistical retention model. Due dates use elapsed time, rather than midnight boundaries.

Progress lives in localStorage in the current browser and site origin. Export a JSON backup before clearing browser data or moving devices; importing replaces current progress after confirmation. There is no account or automatic cloud sync. Explore the deck without changing review schedules.

The app uses a system font fallback if Google Fonts is unavailable.


## Browser regression checks

Playwright is a development-only dependency. Run `npm ci`, then `npx playwright install chromium`. Start the app with `npm start` in another terminal, then run `npm run test:browser`. Set `BASE_URL` to test a different local port, or `CHROMIUM_PATH` to use an existing Chromium installation. These tests use fresh browser profiles and synthetic progress, never your normal study data.

The browser scenarios cover reviewing and keyboard focus, hidden/expanded IPA, exports, valid/invalid/cancelled imports, corrupt storage, failed saves, overdue-first ordering, timed review availability, two tabs, all 44 illustrations/details, and widths from 320 to 1280 pixels.

Overdue reviews are presented before new cards. Review intervals are capped at 100 years to prevent unbounded growth. Backups retain the existing flat JSON format and card IDs. Read errors never overwrite the unreadable saved record; importing a valid backup explicitly replaces it. When saving fails, practice remains available in memory with a warning. Browser tabs re-read saved progress before recording reviews, but localStorage is not transactional: truly simultaneous writes can still conflict. Use one active study tab for the safest experience.

New cards are limited to two per local calendar day, counted when first rated. Scheduled reviews are never limited, including Again repeats. The allowance resets at local midnight and does not accumulate. Introduction dates are included in backups. Existing progress without introduction dates is preserved and does not retroactively consume the new allowance. Browsing the deck does not consume the allowance.


## Audio credits

The 21 shared starting-sound MP3s are unmodified recordings from [The Consonant Sounds of Thai](https://slice-of-thai.com/consonant-sounds/#chart), copyright credit Chris Pirazzi / slice-of-thai.com, licensed under [CC BY-NC 3.0 US](https://creativecommons.org/licenses/by-nc/3.0/us/). Noncommercial use only, with attribution and the license conditions retained. See the on-card recording credit and `research/pronunciation-phase-1/audio-candidates/ATTRIBUTION.md` for provenance. Do not relicense these recordings under a software license. The three research-only word recordings are not wired into the app.

Playback starts only on a tap and stops on card changes, leaving the page or hiding the app. Only one clip plays at a time; unavailable or failed playback can be retried. Files were source-matched and decoded successfully, but independent native-speaker listening review and real iOS/Android device testing remain outstanding. Guaranteed offline playback is not provided.

On desktop, answers use two columns (character/picture and pronunciation) with a compact heading and collapsed study help. Phones retain a stacked answer. Browser regression checks verify that default answers and rating controls fit a 1366 × 768 desktop viewport for all 44 cards; expanding pronunciation or credit details may require scrolling.

The compact phone view uses a short masthead, side-by-side character/picture, reduced whitespace and a smaller progress panel. Thai name text stays at 28px, the main character at 104px, and audio/rating tap targets at least 44px tall. Expanded details remain available and may require scrolling.

“Reset all progress” resets the whole 44-card deck in this browser after confirmation, including review history, due dates and today’s new-card count. It preserves the two-card daily limit. Export a backup first if you may want to restore progress. A storage failure is reported explicitly; the reset then applies only to the current session.


## Home-screen shortcut

The app supplies the short name “Little Thai,” a green ก icon, Android 192/512px and maskable icons, and an iPhone 180px Apple touch icon. The manifest starts at the existing app folder to preserve the site origin and stored progress. There is no service worker or guarantee of offline operation.

Existing home-screen shortcuts may retain their cached title/icon. After publication, open the site in the same browser you study in and add a fresh home-screen shortcut; use “Little Thai” if asked for its name. Once the new shortcut looks correct, remove the old shortcut. Do not clear browser data to refresh an icon, because that can delete learning progress. Browser metadata/icon checks do not replace checking the actual Android or iOS launcher.
