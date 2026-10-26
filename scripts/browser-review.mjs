import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const browser=await chromium.launch({...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),headless:true,args:['--no-sandbox']});
const base=process.env.BASE_URL || 'http://localhost:3000';
const key='little-thai-v1';
const results=[];
async function scenario(name,run){const context=await browser.newContext({viewport:{width:375,height:812},acceptDownloads:true,timezoneId:'Asia/Bangkok'});try{await run(context);results.push(name);console.log('PASS '+name);}finally{await context.close();}}
async function upload(page,data,accept=true){
 page.once('dialog',d=>accept?d.accept():d.dismiss());
 await page.locator('#import').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(typeof data==='string'?data:JSON.stringify(data))});
 await page.waitForFunction(()=>document.querySelector('#import').value==='');
}
await scenario('review, keyboard focus, IPA, export, and reload',async ctx=>{
 const p=await ctx.newPage();await p.goto(base);
 await p.locator('#reveal').focus();await p.keyboard.press('Enter');
 assert.equal(await p.locator('.transliteration').evaluate(e=>e===document.activeElement),true);
 assert.equal(await p.locator('.pronunciation-details').getAttribute('open'),null);
 await p.locator('.pronunciation-details summary').click();assert.equal(await p.locator('.ipa-row').isVisible(),true);
 await p.getByRole('button',{name:'Good 1 day',exact:true}).click();
 assert.equal(await p.locator('#reveal').evaluate(e=>e===document.activeElement),true);
 assert.equal(await p.locator('#learned-count').innerText(),'1');
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const downloading=p.waitForEvent('download');await p.locator('#export').click();
 const download=await downloading;const data=JSON.parse(await readFile(await download.path(),'utf8'));
 assert.equal(data['thai-0'].reviews,1);
 await p.reload();assert.equal(await p.locator('#learned-count').innerText(),'1');
 assert.equal(await p.locator('#study-tab').getAttribute('aria-pressed'),'true');
 await p.locator('#import-button').focus();assert.equal(await p.locator('#import-button').evaluate(e=>e.tagName),'BUTTON');
});
await scenario('backup import, cancellation, rejection and replacement',async ctx=>{
 const p=await ctx.newPage();await p.goto(base);
 const data={'thai-5':{due:Date.now()+86400000,interval:1,reviews:5,lastRating:'good'}};
 await upload(p,data);assert.match(await p.locator('#message').innerText(),/imported and saved/);
 assert.equal(await p.locator('#learned-count').innerText(),'1');
 const before=await p.evaluate(key=>localStorage.getItem(key),key);
 await upload(p,{},false);assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),before);
 for(const invalid of ['{bad json',{'thai-0':{due:9e30,interval:1,reviews:1}},{'unknown':{due:0,interval:1,reviews:1}}]){
  await p.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(typeof invalid==='string'?invalid:JSON.stringify(invalid))});
  await p.waitForFunction(()=>document.querySelector('#import').value==='');
  assert.match(await p.locator('#message').innerText(),/Could not import/);
  assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),before);
 }
 await upload(p,{});assert.equal(await p.locator('#learned-count').innerText(),'0');
});
await scenario('corrupt stored progress is preserved and recoverable',async ctx=>{
 const p=await ctx.newPage();await p.goto(base);
 await p.evaluate(key=>localStorage.setItem(key,'{broken'),key);await p.reload();
 assert.match(await p.locator('#storage-warning').innerText(),/not been overwritten/);
 await p.locator('#reveal').click();await p.getByRole('button',{name:'Good 1 day',exact:true}).click();
 assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),'{broken');
 await upload(p,{});assert.equal(await p.locator('#storage-warning').isVisible(),false);
 assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),'{}');
});
await scenario('storage unavailable: session remains usable with accurate warnings',async ctx=>{
 await ctx.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota exceeded','QuotaExceededError');};});
 const p=await ctx.newPage();await p.goto(base);
 for(let i=0;i<2;i++){await p.locator('#reveal').click();await p.getByRole('button',{name:'Good 1 day',exact:true}).click();}
 assert.equal(await p.locator('#learned-count').innerText(),'2');
 assert.match(await p.locator('#storage-warning').innerText(),/may not be saved/);
 await upload(p,{});assert.match(await p.locator('#message').innerText(),/session only/);
});
await scenario('overdue review before new cards; caught-up state and due-time refresh',async ctx=>{
 const p=await ctx.newPage();await p.clock.install();await p.goto(base);
 const now=await p.evaluate(()=>Date.now());
 await upload(p,{'thai-43':{due:now-1000,interval:1,reviews:1}});
 assert.equal(await p.locator('.character').innerText(),'ฮ');
 const full=Object.fromEntries(Array.from({length:44},(_,i)=>[`thai-${i}`,{due:now+60000,interval:1,reviews:1}]));
 await upload(p,full);assert.equal(await p.getByRole('heading',{name:'Time for a little break.'}).count(),1);
 await p.locator('#explore').focus();await p.clock.fastForward(30000);
 assert.equal(await p.locator('#explore').evaluate(e=>e===document.activeElement),true);
 await p.clock.fastForward(31000);assert.equal(await p.locator('.character').count(),1);
 assert.equal(await p.locator('#due-count').innerText(),'44');
});
await scenario('sequential reviews in two browser tabs preserve both records',async ctx=>{
 const a=await ctx.newPage(),b=await ctx.newPage();await a.goto(base);await b.goto(base);
 await a.locator('#reveal').click();await a.getByRole('button',{name:'Good 1 day',exact:true}).click();
 await b.waitForFunction(()=>document.querySelector('.character').textContent==='ข');
 await b.locator('#reveal').click();await b.getByRole('button',{name:'Easy 4 days',exact:true}).click();
 await a.reload();assert.equal(await a.locator('#learned-count').innerText(),'2');
 const data=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 assert.equal(data['thai-0'].reviews,1);assert.equal(data['thai-1'].reviews,1);
});
await scenario('44 card details: pictures, hints, IPA, classes and mobile layouts',async ctx=>{
 const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.locator('#browse-tab').click();
 assert.equal(await p.locator('#browse-tab').getAttribute('aria-pressed'),'true');
 for(let i=0;i<44;i++){
  await p.locator(`[data-card="thai-${i}"]`).click();
  assert.equal(await p.locator('#detail .illustration').count(),1);
  assert.equal(await p.locator('#detail .sound-row').count(),2);
  assert.equal(await p.locator('#detail .ipa-row').isVisible(),false);
  await p.locator('#detail .pronunciation-details summary').click();assert.equal(await p.locator('#detail .ipa-row').isVisible(),true);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 for(const width of [320,375,768,1280]){await p.setViewportSize({width,height:850});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 assert.deepEqual(errors,[]);
});
await scenario('two new cards per day persist across reload and reset at local midnight',async ctx=>{
 const p=await ctx.newPage();
 // 23:59 in Bangkok: UTC stays on the same day across this local midnight.
 await p.clock.install({time:new Date('2026-10-26T16:59:00Z')});await p.goto(base);
 assert.equal(await p.locator('#due-count').innerText(),'2');
 for(let i=0;i<2;i++){await p.locator('#reveal').click();await p.getByRole('button',{name:'Good 1 day',exact:true}).click();}
 assert.equal(await p.locator('#due-count').innerText(),'0');
 assert.match(await p.locator('#new-card-progress').innerText(),/2 of 2/);
 await p.reload();assert.equal(await p.locator('#due-count').innerText(),'0');
 assert.equal(await p.getByRole('heading',{name:'Time for a little break.'}).count(),1);
 await p.clock.fastForward(61000);
 assert.equal(await p.locator('#due-count').innerText(),'2');
 assert.match(await p.locator('#new-card-progress').innerText(),/0 of 2/);
 assert.equal(await p.locator('.character').innerText(),'ฃ');
});
await scenario('starting-sound audio: all 44 consonants, native playback, navigation stop and retry',async ctx=>{
 await ctx.addInitScript(()=>{
  const NativeAudio=window.Audio;
  window.__audioTests=[];
  window.Audio=function(...args){
   const audio=new NativeAudio(...args);
   const entry={audio,playing:false};window.__audioTests.push(entry);
   audio.addEventListener('playing',()=>{entry.playing=true;});
   return audio;
  };
 });
 const p=await ctx.newPage(),requested=[];
 p.on('request',r=>{if(r.url().endsWith('.mp3'))requested.push(r.url());});
 await p.goto(base);
 assert.equal(await p.locator('[data-starting-audio]').count(),0);
 await p.locator('#reveal').click();
 assert.equal(await p.locator('[data-starting-audio]').count(),1);
 assert.equal(await p.evaluate(()=>window.__audioTests.length),0); // No autoplay.
 await p.locator('[data-starting-audio]').click();
 await p.waitForFunction(()=>window.__audioTests.at(-1)?.playing);
 assert.match(await p.evaluate(()=>window.__audioTests.at(-1).audio.src),/initial-g\.mp3$/);
 await p.locator('#browse-tab').click();
 assert.equal(await p.evaluate(()=>window.__audioTests.every(e=>e.audio.paused)),true);
 const groups={'ก':'g','ขฃคฅฆ':'k','ง':'ng','จ':'j','ฉชฌ':'ch','ซศษส':'s','ญย':'y','ฎด':'d','ฏต':'dt','ฐฑฒถทธ':'t','ณน':'n','บ':'b','ป':'bp','ผพภ':'p','ฝฟ':'f','ม':'m','ร':'r','ลฬ':'l','ว':'w','หฮ':'h','อ':'glottal'};
 const expected=Object.fromEntries(Object.entries(groups).flatMap(([letters,code])=>[...letters].map(letter=>[letter,code])));
 for(let i=0;i<44;i++){
  const id=`thai-${i}`;await p.locator(`[data-card="${id}"]`).click();
  const button=p.locator('[data-starting-audio]');
  assert.equal(await button.count(),1);
  const letter=await button.getAttribute('data-starting-audio');
  assert.equal(await p.evaluate(()=>window.__audioTests.every(e=>e.audio.paused)),true);
  await button.click();await p.waitForFunction(()=>window.__audioTests.at(-1)?.playing);
  assert.ok((await p.evaluate(()=>window.__audioTests.at(-1).audio.src)).endsWith(`initial-${expected[letter]}.mp3`));
  await p.waitForFunction(()=>document.querySelector('[data-starting-audio]').getAttribute('aria-pressed')==='false');
  assert.equal(await p.locator('.audio-status').innerText(),'');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 await p.locator('[data-card="thai-0"]').click();
 await p.locator('.audio-credit summary').click();
 assert.equal(await p.locator('.audio-credit a[rel*="license"]').getAttribute('href'),'https://creativecommons.org/licenses/by-nc/3.0/us/');
 assert.ok(requested.length>=44);assert.equal(requested.some(url=>url.includes('word-')),false);
 await p.route('**/initial-g.mp3',route=>route.fulfill({status:404,body:'missing'}));
 await p.locator('[data-starting-audio]').click();
 await p.waitForFunction(()=>document.querySelector('.audio-status').textContent.includes('retry'));
 assert.equal(await p.locator('[data-starting-audio]').getAttribute('aria-pressed'),'false');
 await p.unroute('**/initial-g.mp3');
 await p.locator('[data-starting-audio]').click();
 await p.waitForFunction(()=>window.__audioTests.at(-1)?.playing);
 await p.locator('[data-starting-audio]').click(); // Explicit stop.
 assert.equal(await p.evaluate(()=>window.__audioTests.every(e=>e.audio.paused)),true);
 const data=await p.evaluate(()=>JSON.parse(localStorage.getItem('little-thai-v1')||'{}'));
 assert.deepEqual(data,{}); // Listening/browsing does not consume the daily allowance.
});
await scenario('compact desktop answer layout keeps all 44 cards and ratings on screen',async ctx=>{
 const p=await ctx.newPage();await p.setViewportSize({width:1366,height:768});await p.goto(base);
 await p.evaluate(()=>{
  const data=Object.fromEntries(Array.from({length:44},(_,i)=>[`thai-${i}`,{due:0,interval:1,reviews:1}]));
  localStorage.setItem('little-thai-v1',JSON.stringify(data));
 });
 await p.reload();assert.equal(await p.locator('.study-help').getAttribute('open'),null);
 for(let i=0;i<44;i++){
  await p.locator('#reveal').click();
  const layout=await p.evaluate(()=>{
   const ratings=document.querySelector('.ratings').getBoundingClientRect();
   const visual=document.querySelector('.answer-visual').getBoundingClientRect();
   const copy=document.querySelector('.answer-copy').getBoundingClientRect();
   return {visible:ratings.bottom<=innerHeight&&ratings.top>=0,columns:visual.right<=copy.left,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.equal(layout.visible,true,`ratings clipped on card ${i}`);
  assert.equal(layout.columns,true);assert.equal(layout.overflow,false);
  await p.getByRole('button',{name:/^Good /}).click();
  await p.evaluate(()=>scrollTo(0,0));
 }
 await p.locator('.study-help summary').click();assert.equal(await p.locator('.help-content').isVisible(),true);
 await p.locator('#browse-tab').click();await p.locator('[data-card="thai-0"]').click();
 for(const [width,height] of [[1920,1080],[1280,800],[1024,768],[800,900],[375,812],[320,812]]){
  await p.setViewportSize({width,height});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}`);
 }
 await p.setViewportSize({width:375,height:812});
 const mobile=await p.evaluate(()=>{
  const visual=document.querySelector('.answer-visual').getBoundingClientRect();
  const copy=document.querySelector('.answer-copy').getBoundingClientRect();
  return copy.top>=visual.bottom;
 });
 assert.equal(mobile,true);
});
const response=await (await browser.newContext()).request.get(base+'/not-here.png');assert.equal(response.status(),404);console.log('PASS server missing-file response');
await browser.close();console.log(`Completed ${results.length} browser scenarios plus HTTP check`);
