import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
test('Manifest provides standalone install and real sized icons',async()=>{
 const m=JSON.parse(await readFile('public/manifest.webmanifest'));assert.equal(m.display,'standalone');assert.equal(m.scope,'/');assert.ok(m.icons.some(i=>i.purpose==='maskable'));
 for(const icon of m.icons){const b=await readFile('public'+icon.src);assert.equal(b.readUInt32BE(16),Number(icon.sizes.split('x')[0]));assert.equal(b.readUInt32BE(20),Number(icon.sizes.split('x')[1]));}
});
test('Build precaches every local app dependency and offline navigation falls back',async()=>{
 const code=await readFile('dist/sw.js','utf8');assert.ok(!code.includes('__VERSION__'));const handlers={};let installed=[];const cached=new Map();const ctx={self:{location:{origin:'https://example.com'},clients:{claim:async()=>{}},addEventListener:(type,fn)=>handlers[type]=fn,skipWaiting:()=>{}},URL,fetch:async()=>{throw Error('Offline');},caches:{open:async()=>({addAll:async a=>{installed=a;}}),keys:async()=>[],delete:async()=>{},match:async req=>cached.get(typeof req==='string'?req:req.url)}};
 vm.runInNewContext(code,ctx);let pending;handlers.install({waitUntil:p=>pending=p});await pending;
 for(const file of ['src/app.js','src/network.js','src/router.js','src/icons.js','src/style.css','src/gestures.js','src/explorer.js','src/facilities.js','src/facility-profiles.js','src/parking-data.js','src/reference.js','src/geometry.js','src/playback.js','src/national-app.js','src/national-data.js','src/national-router.js','maps/malaysia.svg','icon.svg','manifest.webmanifest']){assert.ok(installed.includes('./'+file),file);await access('dist/'+file);}
 const page={body:'offline app'};cached.set('./index.html',page);let response;
 handlers.fetch({request:{method:'GET',url:'https://example.com/?from=klcc',mode:'navigate'},respondWith:p=>response=p});assert.equal(await response,page);
 cached.set('https://example.com/src/network.js',{body:'network'});handlers.fetch({request:{method:'GET',url:'https://example.com/src/network.js'},respondWith:p=>response=p});assert.equal((await response).body,'network');
 let intercepted=false;handlers.fetch({request:{method:'GET',url:'https://operator.com/status'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
});
test('All HTML local assets resolve in the built app',async()=>{
 const html=await readFile('dist/index.html','utf8');for(const match of html.matchAll(/(?:href|src)="(\/[^"?]*)"/g)){if(match[1]!=='/')await access('dist'+match[1]);}
});
