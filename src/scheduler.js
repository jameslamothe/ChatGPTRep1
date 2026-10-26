export const DAY = 86400000;
export const DAILY_NEW_LIMIT = 2;
export function newCardsToday(progress, now=Date.now()) {
  const today=new Date(now).toDateString();
  return Object.values(progress).filter(state=>state.introducedAt!==undefined && new Date(state.introducedAt).toDateString()===today).length;
}
export function nextLocalDay(now=Date.now()) {
  const date=new Date(now);
  date.setHours(24,0,0,0);
  return date.getTime();
}
export function nextAvailableAt(cards,progress,now=Date.now()) {
  const times=Object.values(progress).map(state=>state.due);
  if(cards.some(card=>!progress[card.id])) times.push(nextLocalDay(now));
  return Math.min(...times);
}
export const RATINGS = ['again', 'hard', 'good', 'easy'];
// Bound exponential interval growth so repeated reviews always retain usable dates.
export const MAX_INTERVAL = 36500;
export function schedule(previous, rating, now = Date.now()) {
  if (!RATINGS.includes(rating)) throw new Error('Unknown rating');
  const old = previous?.interval || 0;
  const interval = Math.min(MAX_INTERVAL, rating === 'again' ? 10/1440 : rating === 'hard' ? Math.max(1,old*1.2) : rating === 'good' ? Math.max(1,old*2.5) : Math.max(4,old*3.5));
  return {interval, due:now + interval*DAY, reviews:Math.min(Number.MAX_SAFE_INTEGER,(previous?.reviews || 0)+1), lastRating:rating, ...(previous?.introducedAt!==undefined ? {introducedAt:previous.introducedAt} : !previous ? {introducedAt:now} : {})};
}
export function dueCards(cards, progress, now=Date.now()) {
  const reviews=cards.filter(c=>progress[c.id] && progress[c.id].due<=now)
    .sort((a,b)=>progress[a.id].due-progress[b.id].due);
  const remaining=Math.max(0,DAILY_NEW_LIMIT-newCardsToday(progress,now));
  const fresh=cards.filter(c=>!progress[c.id]).slice(0,remaining);
  return [...reviews,...fresh];
}
export function intervalLabel(interval) {
  return interval < 1 ? `${Math.round(interval*1440)} min` : `${Math.round(interval*10)/10} ${Math.round(interval*10)/10 === 1 ? 'day' : 'days'}`;
}
