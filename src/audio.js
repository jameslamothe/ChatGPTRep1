// Unmodified recordings: Chris Pirazzi / slice-of-thai.com, CC BY-NC 3.0 US.
// Each clip is a mid-tone syllable with /ɔː/, not a full letter name.
const codes = {'ก':'g','ข':'k','ค':'k','ง':'ng','จ':'j','ช':'ch','ด':'d','ต':'dt','บ':'b','ป':'bp'};
export const startingAudio = Object.fromEntries(Object.entries(codes).map(([letter,code])=>[letter,{
 url:new URL(`../research/pronunciation-phase-1/audio-candidates/initial-${code}.mp3`,import.meta.url).href,
 source:`https://slice-of-thai.com/s/pc-${code}/pc-${code}.mp3`
}]));

// Keep one clip active. Ignore late events/promises after navigation or a new tap.
export function createAudioPlayer(makeAudio=url=>new Audio(url)) {
 let active=null;
 let notify=null;
 function stop() {
  const previous=active;
  active=null;
  if(previous){previous.pause();previous.currentTime=0;}
  if(notify)notify('idle','');
  notify=null;
 }
 return {
  stop,
  async play(url,onChange) {
   stop();
   let audio;
   try { audio=makeAudio(url); } catch {onChange('error','Couldn’t play the recording. Tap to retry.');return;}
   active=audio;notify=onChange;
   const finish=(state,message)=>{
    if(active!==audio)return;
    active=null;notify=null;
    audio.pause();onChange(state,message);
   };
   audio.addEventListener('playing',()=>{if(active===audio)onChange('playing','Playing starting sound…');});
   audio.addEventListener('ended',()=>finish('idle',''));
   audio.addEventListener('error',()=>finish('error','Couldn’t load the recording. Check your connection and tap to retry.'));
   onChange('loading','Loading starting sound…');
   try {await audio.play();}
   catch {finish('error','Couldn’t play the recording. Tap to retry.');}
  }
 };
}
