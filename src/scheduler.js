export const DAY = 86400000;
export function schedule(previous, rating, now = Date.now()) {
  if (!['again','hard','good','easy'].includes(rating)) throw new Error('Unknown rating');
  const old = previous?.interval || 0;
  const interval = rating === 'again' ? 10/1440 : rating === 'hard' ? Math.max(1,old*1.2) : rating === 'good' ? Math.max(1,old*2.5) : Math.max(4,old*3.5);
  return {interval, due:now + interval*DAY, reviews:(previous?.reviews || 0)+1, lastRating:rating};
}
export function dueCards(cards, progress, now=Date.now()) {
  return cards.filter(c=> !progress[c.id] || progress[c.id].due <= now).sort((a,b)=>(progress[a.id]?.due || 0)-(progress[b.id]?.due || 0));
}
export function intervalLabel(interval) {
  return interval < 1 ? `${Math.round(interval*1440)} min` : `${Math.round(interval*10)/10} days`;
}
