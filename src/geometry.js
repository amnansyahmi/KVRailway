import {referencePaths} from './reference.js';
import {stationById} from './network.js';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function samplePath(path){
 const tokens=path.match(/[MLCZ]|-?\d+(?:\.\d+)?/g)||[],chunks=[];let at=0,current,chunk;
 const point=()=>({x:Number(tokens[at++]),y:Number(tokens[at++])});
 while(at<tokens.length){const command=tokens[at++];
  if(command==='M'){current=point();chunk=[current];chunks.push(chunk);}
  else if(command==='L'){current=point();chunk.push(current);}
  else if(command==='C'){
   const a=current,b=point(),c=point(),d=point();
   for(let i=1;i<=24;i++){const t=i/24,u=1-t;chunk.push({x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y});}current=d;
  }else if(command==='Z'&&chunk?.length)chunk.push(chunk[0]);
 }
 return chunks;
}
const paths=Object.fromEntries(Object.entries(referencePaths).map(([id,trace])=>[id,trace.flatMap(samplePath)]));
function projection(points,target){let best={index:0,point:points[0],distance:Infinity,t:0};for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((target.x-a.x)*dx+(target.y-a.y)*dy)/(dx*dx+dy*dy||1))),p={x:a.x+t*dx,y:a.y+t*dy},d=distance(target,p);if(d<best.distance)best={index:i,point:p,distance:d,t};}return best;}
export function pointsForEdge(edge){const a=stationById[edge.from],b=stationById[edge.to];if(edge.type==='walk'||!paths[edge.line])return [a,b];let choice;
 for(const points of paths[edge.line]){const start=projection(points,a),end=projection(points,b),cost=start.distance+end.distance;if(!choice||cost<choice.cost)choice={points,start,end,cost};}
 if(!choice||choice.cost>45)return [a,b];const {points,start,end}=choice;const forward=start.index+start.t<=end.index+end.t;
 let middle=forward?points.slice(start.index+1,end.index+1):points.slice(end.index+1,start.index+1).reverse();
 return [a,start.point,...middle,end.point,b].filter((p,i,list)=>!i||distance(list[i-1],p)>.01);
}
export const pathFromPoints=points=>points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
export function legPath(leg){return pathFromPoints(leg.edges.flatMap((e,i)=>{const p=pointsForEdge(e);return i?p.slice(1):p;}));}
export function geometryForRoute(route){return route?.edges.map(edge=>{const points=pointsForEdge(edge),lengths=points.slice(1).map((p,i)=>distance(points[i],p));return {edge,points,lengths,length:lengths.reduce((a,b)=>a+b,0)};})||[];}
export function positionAlongRoute(geometry,progress){if(!geometry.length)return null;const total=geometry.reduce((n,g)=>n+g.length,0);let remaining=Math.max(0,Math.min(progress,.999999))*total;let g=geometry.at(-1);for(const entry of geometry){g=entry;if(remaining<=g.length)break;remaining-=g.length;}let i=0;while(i<g.lengths.length-1&&remaining>g.lengths[i])remaining-=g.lengths[i++];const t=remaining/(g.lengths[i]||1),a=g.points[i],b=g.points[i+1]||a;return {edge:g.edge,x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
