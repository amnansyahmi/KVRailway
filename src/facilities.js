import {parkingData} from './parking-data.js';
import {facilityProfiles} from './facility-profiles.js';
import {stationById,lines,lineById,activeStations,walkingLinks} from './network.js';
import {findRoute} from './router.js';
export const facilityLabels={lift:'Lift',escalator:'Escalator',toilet:'Public toilets',surau:'Surau',ticket:'Ticket machines',staff:'Customer service',feeder:'Feeder bus',bicycle:'Bicycle parking',ramp:'Ramp access',tactile:'Tactile paving',accessibleToilet:'Accessible toilets'};
export function stationDetails(id){
 const s=stationById[id];if(!s)return null;
 const parking=parkingData[id]||null,profile=facilityProfiles[id]||null;
 const connections=walkingLinks.filter(w=>w.from===id||w.to===id).map(w=>({station:w.from===id?w.to:w.from,minutes:w.minutes}));
 const busHub=['gombak','kl-sentral','pasar-seni','titiwangsa','bandar-tasik-selatan','putrajaya-sentral'].includes(id);
 const airport=['klia-t1','klia-t2','terminal-skypark'].includes(id);
 return {station:s,parking,profile,connections,busHub,airport};
}
export const parkingStations=activeStations.filter(s=>parkingData[s.id]);
export function parkingAlternatives(origin,destination,options={},limit=4){
 if(!stationById[origin]||!stationById[destination])return [];
 const candidates=new Map();
 for(const line of lines.filter(l=>l.status==='available'&&l.stops.some(s=>s.station===origin))){
  const stops=line.stops.filter(s=>s.status==='available');const at=stops.findIndex(s=>s.station===origin);
  for(let i=0;i<stops.length;i++){
   const id=stops[i].station,apart=Math.abs(i-at);if(id===origin||apart>6||(!parkingData[id]||parkingData[id].status==='unavailable'))continue;
   const route=findRoute(id,destination,options);if(!route)continue;
   const entry={station:stationById[id],parking:parkingData[id],stopsAway:apart,line:lineById[line.id],route};
   if(!candidates.has(id)||apart<candidates.get(id).stopsAway)candidates.set(id,entry);
  }
 }
 return [...candidates.values()].sort((a,b)=>a.stopsAway-b.stopsAway||Number(b.parking.status==='confirmed')-Number(a.parking.status==='confirmed')||a.route.minutes-b.route.minutes).slice(0,limit);
}
export function mapsUrl(id,{parking=false}={}){
 const s=stationById[id];if(!s)return null;
 const transport=s.lines.some(id=>['kg','py'].includes(id))?'MRT':s.lines.includes('sa')?'LRT Shah Alam':s.lines.some(id=>['kj','ag','sp'].includes(id))?'LRT':s.lines.some(id=>id.startsWith('ktm'))?'KTM':'';
 const query=`${s.name.replace(/ \((MRT|LRT|KTM|Monorail)\)/g,'')} ${transport} station ${parking?'parking':''} Malaysia`;
 return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
