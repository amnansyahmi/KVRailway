import {nationalService,nationalStationById,etsMain,etsBranches,ecrlStations} from './national-data.js';

// This is a corridor explorer, not a timetable or a promise of a direct train.
export function exploreCorridor(service,from,to,{preview=false}={}){
 const rail=nationalService[service];
 if(!rail||(rail.status!=='available'&&!preview))return null;
 const ids=new Set(rail.stations.map(s=>s.id));if(!ids.has(from)||!ids.has(to))return null;
 const chains=service==='ets'?[etsMain,...etsBranches]:[ecrlStations.map(s=>s.id)];
 const graph=new Map([...ids].map(id=>[id,[]]));
 for(const chain of chains)for(let i=1;i<chain.length;i++){graph.get(chain[i-1]).push(chain[i]);graph.get(chain[i]).push(chain[i-1]);}
 const queue=[from],parents=new Map([[from,null]]);
 for(let i=0;i<queue.length&&!parents.has(to);i++)for(const next of graph.get(queue[i]))if(!parents.has(next)){parents.set(next,queue[i]);queue.push(next);}
 if(!parents.has(to))return null;
 const path=[];for(let at=to;at!==null;at=parents.get(at))path.unshift(at);
 const stations=path.map(id=>nationalStationById[id]);
 const junction=etsMain.indexOf('ets-bukit-mertajam');
 const other=from==='ets-butterworth'?to:from;
 const branchChange=service==='ets'&&(from==='ets-butterworth'||to==='ets-butterworth')&&etsMain.indexOf(other)>=0&&etsMain.indexOf(other)<junction;
 const phase=service==='ecrl'?Math.max(...stations.map(s=>s.phase)):null;
 return {service,from,to,stations,path,planned:rail.status!=='available',branchChange,phase,target:phase===2?'January 2028':phase===1?'January 2027':null,states:[...new Set(stations.map(s=>s.state))]};
}
export function corridorGeometry(stations){
 let total=0;const segments=[];
 for(let i=1;i<stations.length;i++){const from=stations[i-1],to=stations[i],length=Math.hypot(to.x-from.x,to.y-from.y);if(length){segments.push({from,to,start:total,length});total+=length;}}
 return {segments,total};
}
export function corridorPosition(geometry,progress){
 if(!geometry.total)return null;
 const at=Math.max(0,Math.min(1,progress))*geometry.total;
 const s=geometry.segments.find(s=>at<=s.start+s.length)||geometry.segments.at(-1);
 const t=Math.max(0,Math.min(1,(at-s.start)/s.length));
 return {x:s.from.x+(s.to.x-s.from.x)*t,y:s.from.y+(s.to.y-s.from.y)*t,from:s.from,to:s.to};
}
