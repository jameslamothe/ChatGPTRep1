# Little Thai

A small Thai consonant flashcard app with spaced repetition. Includes 44 consonants, letter names, rough English transliterations, meanings, and consonant classes. The two obsolete consonants are marked. Transliterations are learning aids and do not convey Thai tones; audio is not included.

## Run

Requires Node.js 20 or newer. No package installation or API keys are needed.

```sh
npm start
```

The server listens on port 3000 (override with `PORT`). Run checks with `npm test`.

## Learning

Try to recall each character's name and class, reveal the answer, and rate your recall. Again returns in 10 minutes; Hard starts at one day and grows by 1.2×; Good starts at one day and grows by 2.5×; Easy starts at four days and grows by 3.5×. This is a simple interval scheduler, not a clinical or statistical retention model. Due dates use elapsed time, rather than midnight boundaries.

Progress lives in localStorage in the current browser and site origin. Export a JSON backup before clearing browser data or moving devices; importing replaces current progress after confirmation. There is no account or automatic cloud sync. Explore the deck without changing review schedules.

The app uses a system font fallback if Google Fonts is unavailable.
