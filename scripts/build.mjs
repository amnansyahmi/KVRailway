import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
await rm('dist', {recursive:true,force:true});
await mkdir('dist', {recursive:true});
await cp('public', 'dist', {recursive:true});
await cp('src', 'dist/src', {recursive:true});
await cp('index.html', 'dist/index.html');
const files=['./','./index.html','./manifest.webmanifest'];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${entry.name}`;if(entry.isDirectory())await walk(p);else if(entry.name!=='sw.js')files.push('./'+p.replace(/^dist\//,''));}}
await walk('dist');
const unique=[...new Set(files)];
const hash=createHash('sha256');for(const p of unique.filter(p=>p!=='./'))hash.update(await readFile('dist/'+p.slice(2)));
let sw=await readFile('public/sw.js','utf8');sw=sw.replace('__VERSION__',hash.digest('hex').slice(0,12)).replace('/*__PRECACHE__*/[]',JSON.stringify(unique));
await writeFile('dist/sw.js',sw);
console.log(`Built dependency-free PWA: ${unique.length} offline assets.`);
