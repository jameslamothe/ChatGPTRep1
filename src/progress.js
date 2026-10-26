import {schedule, RATINGS, DAY, newCardsToday, DAILY_NEW_LIMIT} from './scheduler.js';

export const STORAGE_KEY = 'little-thai-v1';
export const MAX_DATE = 8.64e15;
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function validProgress(data, cardIds) {
  if (!isRecord(data)) return false;
  const ids = new Set(cardIds);
  return Object.entries(data).every(([id, state]) =>
    ids.has(id) && isRecord(state) &&
    Number.isFinite(state.due) && state.due >= 0 && state.due <= MAX_DATE &&
    Number.isFinite(state.interval) && state.interval > 0 && state.interval <= MAX_DATE / DAY &&
    Number.isSafeInteger(state.reviews) && state.reviews >= 0 &&
    (state.introducedAt === undefined || (Number.isFinite(state.introducedAt) && state.introducedAt >= 0 && state.introducedAt <= MAX_DATE)) &&
    (state.lastRating === undefined || RATINGS.includes(state.lastRating))
  );
}

// Whitelist fields so backup files cannot inject markup or extra application state.
function clean(data) {
  return Object.fromEntries(Object.entries(data).map(([id, state]) => [id, {
    due: state.due, interval: state.interval, reviews: state.reviews,
    ...(state.introducedAt === undefined ? {} : {introducedAt:state.introducedAt}),
    ...(state.introducedAt === undefined || (Number.isFinite(state.introducedAt) && state.introducedAt >= 0 && state.introducedAt <= MAX_DATE)) &&
    (state.lastRating === undefined ? {} : {lastRating: state.lastRating})
  }]));
}

export function createProgressStore(storage, cardIds) {
  let data = {};
  let issue = null;
  let corrupt = false;
  let readFailed = false;
  let pending = {};
  let replacing = false;

  function refresh() {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      readFailed = false;
      const next = raw === null ? {} : JSON.parse(raw);
      if (!validProgress(next, cardIds)) throw new SyntaxError('Invalid progress');
      data = replacing ? data : {...clean(next), ...pending};
      issue = Object.keys(pending).length || replacing ? 'unavailable' : null;
      corrupt = false;
    } catch (error) {
      readFailed = true;
      if (error instanceof SyntaxError) {
        issue = 'corrupt';
        corrupt = true;
      } else {
        issue = 'unavailable';
      }
    }
    return data;
  }

  function persist() {
    // Never replace unreadable saved work with an empty or partial practice session.
    if (corrupt || readFailed) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
      pending = {};
      replacing = false;
      issue = null;
      return true;
    } catch {
      issue = 'unavailable';
      return false;
    }
  }

  refresh();
  return {
    get data() { return data; },
    get issue() { return issue; },
    refresh,
    rate(id, rating, now = Date.now()) {
      if (!cardIds.includes(id)) throw new Error('Unknown card');
      // Re-read before changing one card so another tab's reviews are retained.
      refresh();
      if (!data[id] && newCardsToday(data, now) >= DAILY_NEW_LIMIT) {
        throw new Error('Daily new-card limit reached. Continue with your scheduled reviews.');
      }
      data[id] = schedule(data[id], rating, now);
      pending[id] = data[id];
      persist();
      return data;
    },
    replace(next) {
      if (!validProgress(next, cardIds)) throw new Error('Invalid progress backup');
      data = clean(next);
      pending = {};
      replacing = true;
      corrupt = false;
      readFailed = false;
      return persist();
    }
  };
}
