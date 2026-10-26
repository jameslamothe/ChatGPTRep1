import {startingAudio,createAudioPlayer} from './audio.js';
import {illustrations} from './illustrations.js';
import {cards} from './cards.js';
import {createProgressStore, validProgress, STORAGE_KEY} from './progress.js';
import {schedule,dueCards,intervalLabel,newCardsToday,nextAvailableAt,DAILY_NEW_LIMIT} from './scheduler.js';
// Resolve storage lazily: even reading window.localStorage can throw in private modes.
const store=createProgressStore({getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)},cards.map(c=>c.id));
let progress=store.data, mode='study', current=null, revealed=false;
const content=document.querySelector('#content');
const audioPlayer=createAudioPlayer();
let audioButton=null;
function stopAudio() { audioPlayer.stop();audioButton=null; }
content.addEventListener('click',e=>{
 const button=e.target.closest('[data-starting-audio]');
 if(!button)return;
 if(button===audioButton){stopAudio();return;}
 const recording=startingAudio[button.dataset.startingAudio];
 if(!recording)return;
 stopAudio();audioButton=button;
 const status=button.parentElement.querySelector('[role="status"]');
 audioPlayer.play(recording.url,(state,message)=>{
  button.textContent=state==='loading'||state==='playing'?'Stop starting sound':'Play starting sound';
  button.setAttribute('aria-pressed',String(state==='loading'||state==='playing'));
  status.textContent=message;
  if(state==='idle'||state==='error')audioButton=null;
 });
});
window.addEventListener('pagehide',stopAudio);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio();});
function audioControl(c) {
 const recording=startingAudio[c.character];
 if(!recording)return '';
 return `<div class="starting-audio"><button class="audio-button" data-starting-audio="${c.character}" aria-pressed="false">Play starting sound</button><p class="audio-status" role="status"></p><p class="audio-hint">Sound + long “aw” vowel, mid tone—not the full letter name.</p><details class="audio-credit"><summary>Recording credit</summary><p>Audio: Chris Pirazzi / <a href="https://slice-of-thai.com/consonant-sounds/#chart" target="_blank" rel="noopener noreferrer">slice-of-thai.com</a>. <a href="${recording.source}" target="_blank" rel="noopener noreferrer">Original recording</a>, unmodified. <a href="https://creativecommons.org/licenses/by-nc/3.0/us/" target="_blank" rel="license noopener noreferrer">CC BY-NC 3.0 US</a> · noncommercial use.</p></details></div>`;
}
function illustration(c) {
 const {box,outline}=illustrations[c.character];
 const clip=`illustration-${c.id}`;
 return `<svg class="illustration" viewBox="${box.join(' ')}" role="img" aria-label="${c.meaning}"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><polygon points="${outline}"/></clipPath></defs><image href="./Thai%20consonant%20flashcard%20sprite%20sheet.png" width="1448" height="1086" clip-path="url(#${clip})"/></svg>`;
}
function soundLabel(c) {
 const s=c.sounds;
 return `<div class="pronunciation"><div class="sound-row"><strong>Start</strong><span>${s.initialHint}</span></div>${audioControl(c)}<div class="sound-row"><strong>${s.finalLabel}</strong><span>${s.finalHint}</span></div><details class="pronunciation-details"><summary>Show pronunciation details</summary><div class="ipa-row">Start: <span class="ipa">${s.initialIPA}</span> · ${s.finalLabel}: <span class="ipa">${s.finalIPA}</span></div>${s.ipaNotes.length ? `<p class="ipa-notes">${s.ipaNotes.join(' ')}</p>` : ''}<p>English examples are approximate.</p>${s.note ? `<p>${s.note}</p>` : ''}</details></div>`;
}
function answer(c) {
 return `<div class="answer-visual"><div class="character" lang="th">${c.character}</div>${illustration(c)}<p class="meaning">${c.meaning}</p></div><div class="answer-copy"><h2 class="transliteration" tabindex="-1">${c.name}</h2><p lang="th">${c.thai}</p>${soundLabel(c)}<span class="class-tag">${c.group} class</span></div>`;
}

function updateStorageWarning() {
 const warning=document.querySelector('#storage-warning');
 warning.hidden=!store.issue;
 warning.textContent=store.issue==='corrupt'
  ? 'Saved progress could not be read and has not been overwritten. Practice is temporary until you import a valid backup.'
  : 'Browser storage is unavailable. Export a backup before leaving; your latest progress may not be saved.';
}
function revealAnswer() {
 revealed=true;
 render();
 content.querySelector('.transliteration').focus({preventScroll:true});
}
function render(){
 stopAudio();
 updateStorageWarning();
 const due=dueCards(cards,progress);
 document.querySelector('#new-card-progress').textContent=`${newCardsToday(progress)} of ${DAILY_NEW_LIMIT} new cards today · resets at local midnight`;
 const started=cards.filter(c=>progress[c.id]).length;
 document.querySelector('#due-count').textContent=due.length;
 document.querySelector('#learned-count').textContent=started;
 document.querySelector('#progress-fill').style.width=`${started/cards.length*100}%`;
 document.querySelector('#progress-text').textContent=`${started} of 44 characters explored`;
 document.querySelector('#study-tab').classList.toggle('active',mode==='study');
 document.querySelector('#study-tab').setAttribute('aria-pressed',String(mode==='study'));
 document.querySelector('#browse-tab').classList.toggle('active',mode==='browse');
 document.querySelector('#browse-tab').setAttribute('aria-pressed',String(mode==='browse'));
 if(mode==='browse'){
  content.innerHTML=`<div class="deck-heading"><h2>Your consonant collection</h2><p class="muted">Select a character to explore its name and class.</p></div><div class="deck">${cards.map(c=>`<button data-card="${c.id}" class="mini ${progress[c.id]?'started':''}"><span lang="th">${c.character}</span><small>${c.group}</small></button>`).join('')}</div><div id="detail" aria-live="polite"></div>`;
  content.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{stopAudio();const c=cards.find(c=>c.id===b.dataset.card);document.querySelector('#detail').innerHTML=`<div class="detail">${answer(c)}</div>`;});return;
 }
 if(!current || !due.some(c=>c.id===current.id)){current=due[0];revealed=false;}
 if(!current){const next=nextAvailableAt(cards,progress);content.innerHTML=`<div class="flashcard empty"><p class="eyebrow">ALL CAUGHT UP</p><h2>Time for a little break.</h2><p>You’ve finished your available cards for now.</p><p class="muted">Next cards available: ${new Date(next).toLocaleString([], {dateStyle:'medium',timeStyle:'short'})}</p><button class="primary" id="explore">Explore the deck</button></div>`;document.querySelector('#explore').onclick=()=>{mode='browse';render();};return;}
 const c=current;
 content.innerHTML=`<div class="card-top"><span>CONSONANTS <span class="dot">•</span> ${progress[c.id]?'REVIEW':'NEW CHARACTER'}</span><span>${due.length} remaining</span></div><div class="flashcard"><p class="eyebrow">${revealed?'MEET THIS CHARACTER':'DO YOU KNOW THIS CHARACTER?'}</p>${!revealed?`<div class="character" lang="th">${c.character}</div>`:''}${revealed?`<div class="answer" aria-live="polite">${answer(c)}</div>`:`<p class="prompt">Recall its name and starting sound.<br>Take your time.</p><button class="primary" id="reveal">Reveal answer <span>↗</span></button><p class="key-hint">or press space</p>`}</div>${revealed?`<div class="rating-panel"><p>How well did you recall the character and starting sound?</p><p class="rating-hint">Add ending sounds and consonant classes when you’re ready.</p><div class="ratings">${['again','hard','good','easy'].map((r,i)=>`<button data-rating="${r}" class="${r}"><strong>${['Again','Hard','Good','Easy'][i]}</strong><small>${intervalLabel(schedule(progress[c.id],r).interval)}</small></button>`).join('')}</div></div>`:`<p class="under-card">✧ A new alphabet opens up a whole new world.</p>`}`;
 if(!revealed)document.querySelector('#reveal').onclick=revealAnswer;
 content.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>{try { progress=store.rate(c.id,b.dataset.rating); } catch(error) { progress=store.data;document.querySelector('#message').textContent=error.message; } current=null;revealed=false;render();
 const target=content.querySelector('#reveal')||content.querySelector('#explore');
 target?.focus({preventScroll:true});
 content.scrollIntoView({block:'start'});});
}
document.querySelector('#study-tab').onclick=()=>{mode='study';render();};
document.querySelector('#browse-tab').onclick=()=>{mode='browse';render();};
document.addEventListener('keydown',e=>{if(e.code==='Space' && e.target===document.body && mode==='study' && current && !revealed){e.preventDefault();revealAnswer();}});
document.querySelector('#export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='little-thai-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.querySelector('#import-button').onclick=()=>document.querySelector('#import').click();
document.querySelector('#import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>100000)throw Error();const data=JSON.parse(await file.text());if(!validProgress(data,cards.map(c=>c.id)))throw Error();if(!confirm('Replace your current progress with this backup?'))return;const saved=store.replace(data);progress=store.data;current=null;render();document.querySelector('#message').textContent=saved?'Progress imported and saved.':'Progress imported for this session only. Export a backup before leaving.';}catch{document.querySelector('#message').textContent='Could not import. Choose a valid Little Thai progress backup.';}finally{e.target.value='';}};
// Refresh a finished session when a review becomes due, without replacing focused controls.
setInterval(()=>{if(mode==='study'&&!current&&dueCards(cards,progress).length>0)render();},30000);
window.addEventListener('storage',e=>{
 if(e.key!==STORAGE_KEY && e.key!==null)return;
 progress=store.refresh();
 if(mode==='study'&&!revealed)render();else updateStorageWarning();
});
render();
