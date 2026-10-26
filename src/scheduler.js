export const DAY = 86400000;
export const RATINGS = ['again', 'hard', 'good', 'easy'];
// Bound exponential interval growth so repeated reviews always retain usable dates.
export const MAX_INTERVAL = 36500;
export function schedule(previous, rating, now = Date.now()) {
  if (!RATINGS.includes(rating)) throw new Error('Unknown rating');
  const old = previous?.interval || 0;
  const interval = Math.min(MAX_INTERVAL, rating === 'again' ? 10/1440 : rating === 'hard' ? Math.max(1,old*1.2) : rating === 'good' ? Math.max(1,old*2.5) : Math.max(4,old*3.5));
  return {interval, due:now + interval*DAY, reviews:Math.min(Number.MAX_SAFE_INTEGER,(previous?.reviews || 0)+1), lastRating:rating};
}
export function dueCards(cards, progress, now=Date.now()) {
  return cards.filter(c=> !progress[c.id] || progress[c.id].due <= now).sort((a,b)=>(progress[a.id]?.due ?? Infinity)-(progress[b.id]?.due ?? Infinity));
}
export function intervalLabel(interval) {
  return interval < 1 ? `${Math.round(interval*1440)} min` : `${Math.round(interval*10)/10} ${Math.round(interval*10)/10 === 1 ? 'day' : 'days'}`;
}
