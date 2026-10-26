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
 assert.equal(await p.locator('details').getAttribute('open'),null);
 await p.locator('summary').click();assert.equal(await p.locator('.ipa-row').isVisible(),true);
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
  await p.locator('#detail summary').click();assert.equal(await p.locator('#detail .ipa-row').isVisible(),true);
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
const response=await (await browser.newContext()).request.get(base+'/not-here.png');assert.equal(response.status(),404);console.log('PASS server missing-file response');
await browser.close();console.log(`Completed ${results.length} browser scenarios plus HTTP check`);
