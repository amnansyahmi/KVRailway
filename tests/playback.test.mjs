import test from 'node:test';import assert from 'node:assert/strict';
import {createPlayback,mapIsVisible} from '../src/playback.js';
function setup(){let sequence=0;const frames=new Map(),progress=[];const player=createPlayback({requestFrame:fn=>{frames.set(++sequence,fn);return sequence;},cancelFrame:id=>frames.delete(id),onProgress:p=>progress.push(p)});return {player,progress,frames,step:time=>{const batch=[...frames.entries()];frames.clear();for(const [,fn]of batch)fn(time);}};}
test('Mobile map off screen does not consume the journey before the user sees it',()=>{
 const {player,frames,step}=setup();player.load(1000);step(0);step(30000);assert.equal(player.state.progress,0);assert.equal(frames.size,0);player.setVisible(true);step(30000);step(30200);assert.equal(player.state.progress,.2);assert.equal(player.state.playing,true);
});
test('Hiding and showing the map preserves progress without adding background time',()=>{
 const {player,step}=setup();player.setVisible(true);player.load(1000);step(0);step(200);player.setVisible(false);step(60000);assert.equal(player.state.progress,.2);player.setVisible(true);step(60000);step(60100);assert.equal(player.state.progress,.3);
});
test('A deliberate Pause does not restart when the user returns to Network',()=>{
 const {player,step}=setup();player.setVisible(true);player.load(1000);step(0);step(200);player.pause();player.setVisible(false);player.setVisible(true);step(6000);assert.equal(player.state.playing,false);assert.equal(player.state.progress,.2);player.play();step(7000);step(7100);assert.equal(player.state.progress,.3);
});
test('Reduced-motion autoplay stays off, but a deliberate Play works',()=>{
 const {player,step}=setup();player.setVisible(true);player.load(1000,{autoplay:false});assert.equal(player.state.playing,false);player.play();step(0);step(100);assert.equal(player.state.progress,.1);
});
test('A completed journey restarts when explicitly replayed',()=>{
 const {player,step}=setup();player.setVisible(true);player.load(1000);step(0);step(1000);assert.equal(player.state.complete,true);assert.equal(player.state.playing,false);player.play({restart:true});assert.equal(player.state.progress,0);step(2000);step(2100);assert.equal(player.state.progress,.1);
});
test('Changing a route cancels the old frame and resets its duration',()=>{
 const {player,step,frames}=setup();player.setVisible(true);player.load(1000);step(0);step(500);player.load(2000);assert.equal(frames.size,1);assert.equal(player.state.progress,0);step(600);step(1100);assert.equal(player.state.progress,.25);player.load(0);assert.equal(player.state.hasRoute,false);assert.equal(frames.size,0);
});
test('Hidden tabs, covered dialogs and off-screen/hidden layouts suppress playback',()=>{
 const options={viewportHeight:800,viewportWidth:390,bottomInset:80};const visible={top:150,bottom:620,left:20,right:370,width:350,height:470};assert.equal(mapIsVisible(visible,options),true);assert.equal(mapIsVisible({...visible,top:2000,bottom:2470},options),false);assert.equal(mapIsVisible(visible,{...options,pageHidden:true}),false);assert.equal(mapIsVisible(visible,{...options,modalOpen:true}),false);assert.equal(mapIsVisible({...visible,width:0,height:0},options),false);
});
