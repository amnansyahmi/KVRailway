import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {exploreCorridor,corridorGeometry,corridorPosition} from '../src/national-router.js';
import {etsStations,ecrlStations,nationalStationById,nationalService,geoPoint} from '../src/national-data.js';
import {findRoute} from '../src/router.js';
import {stationById} from '../src/network.js';
import {installPageZoomGuard} from '../src/gestures.js';

test('ETS uses the Butterworth branch without detouring north, and reverses continuously',()=>{
 const r=exploreCorridor('ets','ets-kl-sentral','ets-butterworth');assert.equal(r.planned,false);assert.equal(r.branchChange,false);assert.equal(r.path.at(-2),'ets-bukit-mertajam');assert.ok(!r.path.includes('ets-tasek-gelugor'));assert.ok(r.path.includes('ets-ipoh'));assert.deepEqual(exploreCorridor('ets',r.to,r.from).path,[...r.path].reverse());
 assert.equal(exploreCorridor('ets','ets-butterworth','ets-padang-besar').branchChange,true);
});
test('ETS includes the published southern stops to JB and excludes non-ETS commuter stops',()=>{
 const r=exploreCorridor('ets','ets-kl-sentral','ets-jb-sentral');for(const id of ['ets-batang-melaka','ets-gemas','ets-bekok','ets-paloh','ets-rengam','ets-kempas-baru'])assert.ok(r.path.includes(id),id);assert.equal(nationalStationById['ets-behrang'],undefined);assert.equal(nationalStationById['ets-kuala-kubu-bharu'],undefined);
});
test('ECRL requires an explicit preview and keeps opening phases distinct',()=>{
 assert.equal(exploreCorridor('ecrl','ecrl-kota-bharu','ecrl-itt-gombak'),null);
 const first=exploreCorridor('ecrl','ecrl-kota-bharu','ecrl-itt-gombak',{preview:true});assert.equal(first.planned,true);assert.equal(first.phase,1);assert.equal(first.target,'January 2027');assert.equal(first.path.length,16);
 const full=exploreCorridor('ecrl','ecrl-kota-bharu','ecrl-jalan-kastam',{preview:true});assert.equal(full.phase,2);assert.equal(full.target,'January 2028');assert.equal(full.path.length,20);assert.ok(ecrlStations.every(s=>s.status==='planned'));
 assert.equal(findRoute('ecrl-kota-bharu','klcc'),null);assert.equal(exploreCorridor('ets','ets-kl-sentral','ecrl-kota-bharu',{preview:true}),null);
});
test('Every national selection produces continuous finite preview geometry with exact endpoints',()=>{
 for(const service of ['ets','ecrl']){const list=nationalService[service].stations;for(const from of list)for(const to of list){const r=exploreCorridor(service,from.id,to.id,{preview:true});assert.ok(r);const g=corridorGeometry(r.stations);if(from===to){assert.equal(g.total,0);assert.equal(corridorPosition(g,.5),null);continue;}const start=corridorPosition(g,0),end=corridorPosition(g,1);assert.equal(start.x,from.x);assert.equal(start.y,from.y);assert.ok(Math.hypot(end.x-to.x,end.y-to.y)<1e-8);const mid=corridorPosition(g,.5);assert.ok(Number.isFinite(mid.x)&&Number.isFinite(mid.y));}}
});
test('National station coordinates share the basemap projection and local links resolve',()=>{
 for(const s of [...etsStations,...ecrlStations]){assert.deepEqual(geoPoint(s.lon,s.lat),{x:s.x,y:s.y});assert.ok(s.x>=30&&s.x<=525&&s.y>=30&&s.y<=720);if(s.cityStation)assert.ok(stationById[s.cityStation],s.cityStation);}
});
test('Map gesture exemption covers both city and Malaysia viewports',()=>{
 const handlers={};installPageZoomGuard({addEventListener:(type,fn)=>handlers[type]=fn});
 for(const surface of ['#map-viewport','[data-map-viewport]']){let blocked=false;const target={closest:selector=>selector.includes(surface)?{}:null};handlers.touchmove({touches:[{},{}],target,preventDefault:()=>blocked=true});assert.equal(blocked,false);handlers.wheel({ctrlKey:true,target,preventDefault:()=>blocked=true});assert.equal(blocked,false);}
});
test('The country basemap is bundled and contains no live map or remote image dependencies',async()=>{
 const svg=await readFile('public/maps/malaysia.svg','utf8');assert.match(svg,/Natural Earth/);assert.match(svg,/EAST MALAYSIA/);assert.ok(!/(?:href|src)="https?:/.test(svg));assert.match(svg,/smaller context inset/);
});
