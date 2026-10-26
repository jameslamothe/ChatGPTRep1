import {cards} from './cards.js';
import {schedule,dueCards,intervalLabel} from './scheduler.js';
const key='little-thai-v1';
let progress={}, mode='study', current=null, revealed=false;
const content=document.querySelector('#content');
function soundLabel(c) {
 return `<div class="sound-label"><small>${c.sounds.label}</small><span>${c.sounds.note}</span></div>`;
}

function valid(data) {
  return data && typeof data==='object' && !Array.isArray(data) && Object.entries(data).every(([id,s])=>cards.some(c=>c.id===id) && s && Number.isFinite(s.due) && s.due>=0 && Number.isFinite(s.interval) && s.interval>0 && Number.isInteger(s.reviews) && s.reviews>=0);
}
try {const saved=localStorage.getItem(key);if(saved){const data=JSON.parse(saved);if(!valid(data))throw Error();progress=data;}} catch {document.querySelector('#storage-warning').hidden=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(progress));}catch{document.querySelector('#storage-warning').hidden=false;}}
function render(){
 const due=dueCards(cards,progress);
 const started=cards.filter(c=>progress[c.id]).length;
 document.querySelector('#due-count').textContent=due.length;
 document.querySelector('#learned-count').textContent=started;
 document.querySelector('#progress-fill').style.width=`${started/cards.length*100}%`;
 document.querySelector('#progress-text').textContent=`${started} of 44 characters explored`;
 document.querySelector('#study-tab').classList.toggle('active',mode==='study');
 document.querySelector('#browse-tab').classList.toggle('active',mode==='browse');
 if(mode==='browse'){
  content.innerHTML=`<div class="deck-heading"><h2>Your consonant collection</h2><p class="muted">Select a character to explore its name and class.</p></div><div class="deck">${cards.map(c=>`<button data-card="${c.id}" class="mini ${progress[c.id]?'started':''}"><span lang="th">${c.character}</span><small>${c.group}</small></button>`).join('')}</div><div id="detail" aria-live="polite"></div>`;
  content.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{const c=cards.find(c=>c.id===b.dataset.card);document.querySelector('#detail').innerHTML=`<div class="detail"><h2 lang="th">${c.thai}</h2><p>${c.name}</p>${soundLabel(c)}<p>${c.meaning}</p><span class="class-tag">${c.group} class</span></div>`;});return;
 }
 if(!current || !due.some(c=>c.id===current.id)){current=due[0];revealed=false;}
 if(!current){const next=Math.min(...Object.values(progress).map(s=>s.due));content.innerHTML=`<div class="flashcard empty"><p class="eyebrow">ALL CAUGHT UP</p><h2>Time for a little break.</h2><p>You’ve reviewed every card that’s due.</p><p class="muted">Next review: ${new Date(next).toLocaleString([], {dateStyle:'medium',timeStyle:'short'})}</p><button class="primary" id="explore">Explore the deck</button></div>`;document.querySelector('#explore').onclick=()=>{mode='browse';render();};return;}
 const c=current;
 content.innerHTML=`<div class="card-top"><span>CONSONANTS <span class="dot">•</span> ${progress[c.id]?'REVIEW':'NEW CHARACTER'}</span><span>${due.length} remaining</span></div><div class="flashcard"><p class="eyebrow">${revealed?'MEET THIS CHARACTER':'DO YOU KNOW THIS CHARACTER?'}</p><div class="character" lang="th">${c.character}</div>${revealed?`<div class="answer" aria-live="polite"><h2>${c.name}</h2>${soundLabel(c)}<p lang="th">${c.thai}</p><p>${c.meaning}</p><span class="class-tag">${c.group} class</span></div>`:`<p class="prompt">Say its name. Remember its class.<br>Take your time.</p><button class="primary" id="reveal">Reveal answer <span>↗</span></button><p class="key-hint">or press space</p>`}</div>${revealed?`<div class="rating-panel"><p>How well did you remember?</p><div class="ratings">${['again','hard','good','easy'].map((r,i)=>`<button data-rating="${r}" class="${r}"><strong>${['Again','Hard','Good','Easy'][i]}</strong><small>${intervalLabel(schedule(progress[c.id],r).interval)}</small></button>`).join('')}</div></div>`:`<p class="under-card">✧ A new alphabet opens up a whole new world.</p>`}`;
 if(!revealed)document.querySelector('#reveal').onclick=()=>{revealed=true;render();};
 content.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>{progress[c.id]=schedule(progress[c.id],b.dataset.rating);save();current=null;revealed=false;render();});
}
document.querySelector('#study-tab').onclick=()=>{mode='study';render();};
document.querySelector('#browse-tab').onclick=()=>{mode='browse';render();};
document.addEventListener('keydown',e=>{if(e.code==='Space' && e.target===document.body && mode==='study' && current && !revealed){e.preventDefault();revealed=true;render();}});
document.querySelector('#export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='little-thai-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.querySelector('#import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>100000)throw Error();const data=JSON.parse(await file.text());if(!valid(data))throw Error();if(!confirm('Replace your current progress with this backup?'))return;progress=data;save();current=null;render();document.querySelector('#message').textContent='Progress imported.';}catch{document.querySelector('#message').textContent='Could not import. Choose a valid Little Thai progress backup.';}finally{e.target.value='';}};
setInterval(()=>{if(mode==='study'&&!revealed)render();},30000);
render();
