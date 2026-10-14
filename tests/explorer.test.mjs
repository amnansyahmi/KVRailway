import test from 'node:test';import assert from 'node:assert/strict';
import {parkingAlternatives,stationDetails,parkingStations,mapsUrl} from '../src/facilities.js';
import {findRoute} from '../src/router.js';import {stationById,lineById,activeStations} from '../src/network.js';
import {zoomView,installPageZoomGuard} from '../src/gestures.js';
import {geometryForRoute,positionAlongRoute,samplePath} from '../src/geometry.js';
import {facilityProfiles} from '../src/facility-profiles.js';
test('Park & Ride choices can become valid journey origins and exclude closed facilities',()=>{
 const options=parkingAlternatives('subang-jaya','klcc',{allowAirport:false});assert.ok(options.some(o=>o.station.id==='glenmarie'));for(const o of options){assert.equal(o.route.from,o.station.id);assert.equal(o.route.to,'klcc');assert.ok(o.stopsAway<=6);assert.notEqual(o.parking.status,'unavailable');assert.equal(o.station.status,'available');}
});
test('Operator-confirmed parking has station-specific evidence, while map records never invent capacity',()=>{
 for(const s of parkingStations){const p=stationDetails(s.id).parking;if(p.status==='confirmed')assert.match(p.url,/^https:\/\/(www\.)?(mymrt|myrapid)\.com\.my\//);if(p.status==='reference'){assert.equal(p.bays,undefined);assert.equal(p.operator,undefined);}}
 assert.equal(stationDetails('taman-equine').parking.bays,352);assert.equal(stationDetails('gombak').parking.bays,1260);assert.equal(stationDetails('maluri').parking.status,'unavailable');
});
test('Facilities remain unknown when no station source was checked',()=>{
 assert.equal(stationDetails('subang-jaya').profile,null);assert.equal(stationDetails('not-a-station'),null);for(const [id,p] of Object.entries(facilityProfiles)){assert.ok(stationById[id]);assert.match(p.source,/^https:\/\/www\.mymrt\.com\.my\/projects\//);assert.ok(p.facilities.length);}
 assert.ok(stationDetails('taman-equine').profile.facilities.includes('toilet'));
});
test('Map links use a station search, never the schematic coordinates as latitude/longitude',()=>{
 const url=new URL(mapsUrl('glenmarie',{parking:true}));assert.equal(url.pathname,'/maps/search/');assert.match(url.searchParams.get('query'),/Glenmarie.*parking/);assert.equal(mapsUrl('bad'),null);
});
test('Bukit Kiara Selatan is excluded and trains go directly Phileo to Pusat Bandar Damansara',()=>{
 assert.equal(stationById['bukit-kiara-selatan'].status,'planned');assert.equal(findRoute('bukit-kiara-selatan','klcc'),null);const r=findRoute('phileo-damansara','pusat-bandar-damansara');assert.equal(r.stops,1);assert.equal(r.legs[0].line,'kg');
});
test('Reference colours preserve the PDF line identity',()=>{assert.equal(lineById.kj.color,'#ff2261');assert.equal(lineById.py.color,'#f9a433');assert.equal(lineById.ktm1.color,'#186dd3');assert.equal(lineById.sa.color,'#3db2e2');});
test('Map zoom keeps the focal point fixed and clamps extreme pinches',()=>{
 const v=[10,20,400,300],p={x:110,y:95},n=zoomView(v,.5,p);assert.equal((p.x-v[0])/v[2],(p.x-n[0])/n[2]);assert.equal((p.y-v[1])/v[3],(p.y-n[1])/n[3]);assert.equal(zoomView(v,.001,p)[2],85);assert.equal(zoomView(v,100,p)[2],900);assert.deepEqual(zoomView(v,Infinity,p),v);
});
test('Page zoom guard blocks browser gestures while leaving custom map pinch handling available',()=>{
 const handlers={};installPageZoomGuard({addEventListener:(type,fn)=>handlers[type]=fn});let prevented=false;const event={touches:[{},{}],target:{closest:()=>null},preventDefault:()=>prevented=true};handlers.touchmove(event);assert.equal(prevented,true);prevented=false;handlers.touchmove({...event,target:{closest:()=>({})}});assert.equal(prevented,false);handlers.gesturechange(event);assert.equal(prevented,true);prevented=false;handlers.wheel({...event,ctrlKey:true});assert.equal(prevented,true);
});
test('Curved route playback begins and ends at the selected station and stays finite',()=>{
 const r=findRoute('subang-jaya','klcc',{allowAirport:false}),g=geometryForRoute(r),start=positionAlongRoute(g,0),end=positionAlongRoute(g,1);assert.equal(start.x,stationById[r.from].x);assert.equal(start.y,stationById[r.from].y);assert.ok(Math.hypot(end.x-stationById[r.to].x,end.y-stationById[r.to].y)<.01);for(let i=0;i<=100;i++){const p=positionAlongRoute(g,i/100);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(r.edges.includes(p.edge));}assert.ok(g.some(e=>e.points.length>3));
});
test('Bezier sampling preserves endpoints and separate paths',()=>{
 const chunks=samplePath('M0,0 C0,10,10,10,10,0 M20,0 L30,0');assert.equal(chunks.length,2);assert.deepEqual(chunks[0][0],{x:0,y:0});assert.deepEqual(chunks[0].at(-1),{x:10,y:0});assert.deepEqual(chunks[1].at(-1),{x:30,y:0});
});
