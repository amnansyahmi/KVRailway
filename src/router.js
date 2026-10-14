import {lines,walkingLinks,stationById,lineById} from './network.js';
export const graph = new Map();
function add(from,edge){if(!graph.has(from))graph.set(from,[]);graph.get(from).push(edge);}
for(const line of lines.filter(l=>l.status==='available')){
 const stops=line.stops.filter(s=>s.status==='available');
 for(let i=1;i<stops.length;i++){
  const from=stops[i-1].station,to=stops[i].station;
  let minutes=line.minutes;
  if(line.id==='ke')minutes=i===1?28:3;
  if(line.id==='kt')minutes=[0,10,13,9,7,3][i];
  if(line.id.startsWith('ktm') && ['tanjung-malim','kuala-kubu-bharu','rasa','batang-kali','rawang','kajang','bangi','batang-benar','nilai','labu','tiroi','seremban','senawang','sungai-gadut','rembau'].includes(from))minutes=8;
  add(from,{to,line:line.id,minutes,type:'ride'});add(to,{to:from,line:line.id,minutes,type:'ride'});
 }
}
for(const link of walkingLinks){
 if(!stationById[link.from]||!stationById[link.to])throw new Error('Invalid walking link');
 add(link.from,{to:link.to,minutes:link.minutes,type:'walk'});
 add(link.to,{to:link.from,minutes:link.minutes,type:'walk'});
}
// Routing uses station + current service state, so transfers are counted correctly.
export function findRoute(from,to,{preference='fastest',allowAirport=true}={}){
 if(!graph.has(from)||!graph.has(to))return null;
 if(from===to)return {from,to,edges:[],legs:[],minutes:0,transfers:0,stops:0,walkMinutes:0};
 const start=`${from}|`;const distance=new Map([[start,0]]),previous=new Map(),open=new Set([start]),closed=new Set();let goal;
 while(open.size){
  let key,best=Infinity;for(const candidate of open){const cost=distance.get(candidate);if(cost<best){key=candidate;best=cost;}}
  open.delete(key);closed.add(key);const [station,currentLine]=key.split('|');
  if(station===to){goal=key;break;}
  for(const edge of graph.get(station)||[]){
   if(edge.line && !allowAirport && lineById[edge.line].airport)continue;
   const transfer=edge.type==='ride'&&currentLine&&currentLine!==edge.line?1:0;
   const nextLine=edge.type==='ride'?edge.line:currentLine;
   const next=`${edge.to}|${nextLine}`;if(closed.has(next))continue;
   // The transfer-first mode is lexicographic for this network (<1000 min per trip).
   const transferMinutes=transfer?4:0;
   const cost=best+edge.minutes+transferMinutes+(preference==='transfers'?transfer*1000:0);
   if(cost<(distance.get(next)??Infinity)){
    distance.set(next,cost);previous.set(next,{key,edge:{...edge,from:station,transfer:Boolean(transfer),transferMinutes}});open.add(next);
   }
  }
 }
 if(!goal)return null;
 const edges=[];for(let k=goal;k!==start;){const p=previous.get(k);edges.unshift(p.edge);k=p.key;}
 const legs=[];for(const edge of edges){
  const last=legs.at(-1);
  if(last&&last.type===edge.type&&last.line===edge.line){last.edges.push(edge);last.to=edge.to;last.minutes+=edge.minutes;}
  else legs.push({type:edge.type,line:edge.line,from:edge.from,to:edge.to,minutes:edge.minutes,transferMinutes:edge.transferMinutes,edges:[edge]});
 }
 for(const leg of legs.filter(l=>l.type==='ride')){
  const l=lineById[leg.line],indices=l.stops.filter(s=>s.status==='available').map(s=>s.station);
  leg.direction=stationById[indices.indexOf(leg.to)>indices.indexOf(leg.from)?indices.at(-1):indices[0]].name;
 }
 return {from,to,edges,legs,minutes:Math.ceil(edges.reduce((n,e)=>n+e.minutes+e.transferMinutes,0)),transfers:edges.filter(e=>e.transfer).length,stops:edges.filter(e=>e.type==='ride').length,walkMinutes:edges.filter(e=>e.type==='walk').reduce((n,e)=>n+e.minutes,0)};
}
