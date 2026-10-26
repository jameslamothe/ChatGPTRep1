import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('home-screen label stays short and launch URLs preserve the existing site',async()=>{
 const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',root)));
 assert.equal(manifest.name,'Little Thai');assert.equal(manifest.short_name,'Little Thai');
 assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.id,'./');
 assert.equal(manifest.display,'standalone');
 assert.ok(manifest.icons.some(i=>i.purpose==='maskable'));
 for(const i of manifest.icons){
  const bytes=await readFile(new URL(i.src,root));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,i.sizes);
 }
});
test('shortcut metadata includes favicon, Apple touch icon and a readable title',async()=>{
 const html=await readFile(new URL('index.html',root),'utf8');
 assert.match(html,/<title>Little Thai<\/title>/);
 assert.match(html,/name="apple-mobile-web-app-title" content="Little Thai"/);
 assert.match(html,/rel="apple-touch-icon" sizes="180x180"/);
 const bytes=await readFile(new URL('icons/apple-touch-icon.png',root));
 assert.equal(bytes.readUInt32BE(16),180);assert.equal(bytes.readUInt32BE(20),180);
});
