# Quality review — 26 October 2026

Scope: current 44-consonant app, including pronunciation content, illustrations, scheduling, persistence, imports/exports, keyboard access, mobile layout, and the local development server. No new learning features were added.

## Findings and fixes

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | Invalid saved JSON or invalid entries were treated like unavailable storage; subsequent reviews could overwrite the original saved work. | Read failures preserve the original record. Temporary practice remains available with a specific warning; importing a valid backup explicitly restores saving. |
| High | Backups accepted dates outside JavaScript's valid range and unsafe review counts. | Shared validation rejects unusable dates, nonpositive intervals, invalid ratings, unknown cards and unsafe counts before replacement. Existing valid backups remain compatible. |
| Medium | Two open tabs could overwrite each other's earlier reviews. | Re-read and merge before recording a review and refresh on storage events. Tested sequential interleaved reviews; simultaneous writes remain a localStorage limitation. |
| Medium | New cards sorted before overdue reviews. | Existing overdue cards come first, oldest due date first. |
| Medium | Repeated successful reviews could grow intervals without a bound. | Cap intervals at 36,500 days and saturate review counts at the safe integer limit. Ordinary review intervals are unchanged. |
| Medium | Import used a label attached to a hidden input, which was not reachable by keyboard. Reveal/rating removed focused elements. | Import is a real button. Focus moves to the answer on reveal and to the next review control after rating. Current study mode is exposed through aria-pressed. |
| Medium | Periodic full renders could remove keyboard focus. | Poll only for a newly due review on the finished-session screen; leave active question controls untouched. |
| Medium | Supporting text had insufficient contrast; measured examples ranged from 2.94:1 to 3.9:1. | Darken supporting text and remove rating-label opacity. Common small-text combinations now meet 4.5:1; this is not a full accessibility certification. |
| Low | Missing local-server assets had success headers prepared before the file read finished. | Read the asset before preparing the success response; verify missing files return 404. |
| Low | Test coverage missed storage, imports, tab interactions, stable IDs and review ordering. | Add regression tests and a reproducible Playwright review script. Extract storage/validation from the UI into src/progress.js. |

## Learning content

- Reviewed all 44 consonants for the standard 9 mid / 11 high / 24 low class grouping; added a regression check for the complete mapping.
- Reviewed the starting/ending sound mapping, aspiration contrasts, unreleased final stops, nasal endings, unused endings, obsolete letters, the variable pronunciation of ฑ, and ย/ว vowel glides. Existing current mappings were retained.
- Visually checked all 44 illustration matches and checked every viewport's bounds.
- Retained all existing card IDs and ordering, preserving the association with saved progress.
- Tone-marked names use a learner transliteration rather than full IPA, and do not encode vowel length. English comparison words are approximate and accent-dependent.
- **Outstanding:** the names, tone marks, and phonetic descriptions have not received independent review by a qualified Thai teacher or phonetician. An attempted external Thai-script reference request returned HTTP 403. Internal consistency tests are not evidence of native-speaker certification. Expert checking is recommended before treating this as authoritative teaching material.

## Validation

- `npm test`: 21 tests passed, no failures or skips.
- Playwright: seven browser scenarios passed, plus a missing-asset HTTP check. Covered keyboard focus, optional IPA, exports, valid/invalid/cancelled imports, corrupt saved state, quota failures, two tabs, overdue-first ordering, finished-session timing, all 44 card details and image viewports, and widths 320/375/768/1280 px.
- The suite uses synthetic progress in isolated Chromium profiles. It does not touch real users' learning data.
- Browser checks were run against the local server. Live GitHub Pages publication is separate from these results.
- Real iOS/Android browser testing and a full screen-reader audit were not performed.

## Remaining limitations

Progress is local to one browser and origin; backups are still necessary. There is no device sync. localStorage has no atomic multi-tab transaction, so truly simultaneous reviews may conflict; prefer one active study tab. The scheduler is a simple interval heuristic, not a calibrated retention model. No additional learning features were introduced during this review.

For rerunning the checks, see README.md.
