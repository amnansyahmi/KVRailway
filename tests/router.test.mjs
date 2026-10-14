import test from 'node:test';
import assert from 'node:assert/strict';
import {findRoute,graph} from '../src/router.js';
import {activeStations,stations,lineById,stationById} from '../src/network.js';
test('Subang Jaya to KLCC stays on Kelana Jaya with the correct direction',()=>{
 const r=findRoute('subang-jaya','klcc',{allowAirport:false});
 assert.equal(r.transfers,0);assert.equal(r.stops,18);assert.equal(r.legs.length,1);assert.equal(r.legs[0].line,'kj');assert.equal(r.legs[0].direction,'Gombak');
});
test('Reverse journeys point towards the opposite terminus',()=>{
 const r=findRoute('klcc','subang-jaya',{allowAirport:false});assert.equal(r.legs[0].direction,'Putra Heights');
});
test('A same-station journey does not invent movement',()=>{
 const r=findRoute('klcc','klcc');assert.equal(r.minutes,0);assert.deepEqual(r.edges,[]);
});
test('Invalid and planned endpoints cannot be routed',()=>{
 assert.equal(findRoute('bad-id','klcc'),null);assert.equal(findRoute('rri','klcc'),null);assert.equal(findRoute('terminal-skypark','klcc'),null);
});
test('Planned and suspended services never enter the routing graph',()=>{
 for(const s of stations.filter(s=>s.status!=='available'))assert.equal(graph.has(s.id),false,s.name);
 for(const edges of graph.values())for(const e of edges)if(e.line)assert.equal(lineById[e.line].status,'available');
});
test('Skipping a future stop preserves through travel on operating lines',()=>{
 const r=findRoute('kwasa-damansara','kampung-selamat');assert.equal(r.stops,1);assert.equal(r.legs[0].line,'py');
 const sa=findRoute('johan-setia','bandar-bukit-tinggi');assert.equal(sa.stops,1);assert.equal(sa.legs[0].line,'sa');
});
test('Airport destinations require enabling airport trains',()=>{
 assert.equal(findRoute('kl-sentral','klia-t2',{allowAirport:false}),null);
 const r=findRoute('kl-sentral','klia-t2',{allowAirport:true});assert.equal(r.legs[0].line,'ke');assert.equal(r.minutes,31);assert.equal(r.stops,2);
});
test('Fewer transfers keeps Batu Caves to Kajang on KTM',()=>{
 const r=findRoute('batu-caves','kajang',{preference:'transfers'});assert.equal(r.transfers,0);assert.equal(r.legs[0].line,'ktm1');
});
test('Fewer transfers keeps Ampang to Putra Heights to one change',()=>{
 const r=findRoute('ampang','putra-heights',{preference:'transfers',allowAirport:false});assert.equal(r.transfers,1);assert.deepEqual(r.legs.map(l=>l.line),['ag','sp']);assert.equal(r.legs[0].to,'chan-sow-lin');
});
test('Bandar Utama has an explicit walking connection between MRT and LRT',()=>{
 const r=findRoute('bandar-utama-mrt','bandar-utama-lrt');assert.equal(r.legs[0].type,'walk');assert.equal(r.walkMinutes,7);
});
test('KL Sentral and Muzium Negara include the connecting walk',()=>{
 const r=findRoute('kl-sentral','muzium-negara');assert.equal(r.legs.length,1);assert.equal(r.legs[0].type,'walk');assert.equal(r.walkMinutes,6);
});
test('Walking followed by another train counts one transfer',()=>{
 const r=findRoute('johan-setia','klcc',{allowAirport:false,preference:'transfers'});assert.ok(r.legs.some(l=>l.type==='walk'));assert.equal(r.transfers,1);assert.equal(r.legs.at(-1).direction,'Gombak');
});
test('Distinct Sentul and Salak Selatan stations are not merged by name',()=>{
 assert.notEqual(stationById['sentul-lrt'].id,stationById['sentul-ktm'].id);assert.notEqual(stationById['salak-selatan-lrt'].id,stationById['salak-selatan-ktm'].id);
});
test('Every available station is connected, with continuous valid journeys',()=>{
 for(const s of activeStations){
  for(const preference of ['fastest','transfers']){
   const r=findRoute('kl-sentral',s.id,{preference});assert.ok(r,s.name);
   let previous='kl-sentral';for(const edge of r.edges){assert.equal(edge.from,previous);assert.ok(graph.get(edge.from).some(e=>e.to===edge.to&&e.type===edge.type&&e.line===edge.line));previous=edge.to;}
   assert.equal(previous,s.id);assert.equal(r.stops,r.edges.filter(e=>e.type==='ride').length);assert.equal(r.transfers,r.edges.filter(e=>e.transfer).length);
  }
 }
});
