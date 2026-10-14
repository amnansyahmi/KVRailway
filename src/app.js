import {lines,stations,activeStations,stationById,lineById,walkingLinks,majorStations} from './network.js';
import {findRoute} from './router.js';
import {icon} from './icons.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const name=id=>stationById[id]?.name||'';
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const state={from:'subang-jaya',to:'klcc',preference:'fastest',allowAirport:false,route:null,view:[40,90,540,580],future:false,threeD:false,playing:false,progress:0,elapsed:0,frame:0};
let saved=[];try{const raw=JSON.parse(localStorage.getItem('kvrailway.saved')||'[]');if(Array.isArray(raw))saved=raw.filter(s=>stationById[s.from]&&stationById[s.to]).slice(0,20);}catch{}
let toastTimer,installPrompt;
const toast=message=>{clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,4200);};
for(const [id,type] of Object.entries({'about-button':'info','close-about':'close','swap':'swap','plan-arrow':'arrow','cube-icon':'cube','zoom-in':'plus','zoom-out':'minus','fit':'fit','focus-route':'focus','play':'play','replay':'replay','foot-icon':'train','nav-plan':'route','nav-map':'map','nav-save':'save'}))$(id).innerHTML=icon(type);
$('network-count').textContent=`${activeStations.length} stations · 12 available lines`;
function codeLabel(sid){const s=stationById[sid];return s? s.codes.filter((c,i)=>lineById[s.lines[i]].status==='available').join(' · '):'';}
function updateFields(){for(const field of ['from','to']){$(`${field}-input`).value=name(state[field]);$(`${field}-code`).textContent=codeLabel(state[field]);} $('airport').checked=state.allowAirport;document.querySelectorAll('[data-pref]').forEach(b=>{const selected=b.dataset.pref===state.preference;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected);});}
function setStation(field,id){state[field]=id;updateFields();closeSuggestions();$('form-error').hidden=true;}
function closeSuggestions(){for(const field of ['from','to']){$(`${field}-options`).hidden=true;$(`${field}-input`).setAttribute('aria-expanded','false');$(`${field}-input`).removeAttribute('aria-activedescendant');}}
for(const field of ['from','to']){
 const input=$(`${field}-input`),list=$(`${field}-options`);let options=[],index=-1;
 function search(){const q=input.value.trim().toLowerCase();options=activeStations.filter(s=>`${s.name} ${s.codes.join(' ')}`.toLowerCase().includes(q)).slice(0,40);index=-1;
  list.innerHTML=options.length?options.map((s,i)=>`<button type="button" role="option" aria-selected="false" tabindex="-1" class="suggestion" id="${field}-option-${i}" data-station="${s.id}"><span class="suggestion-name">${esc(s.name)}</span><small>${esc(codeLabel(s.id).split(' · ').slice(0,2).join(' · '))}</small></button>`).join(''):'<div class="empty-search">No station found. Try a station name or code.</div>';
  list.hidden=false;input.setAttribute('aria-expanded','true');
 }
 input.addEventListener('focus',()=>{closeSuggestions();search();input.select();});
 input.addEventListener('input',()=>{state[field]=null;$(`${field}-code`).textContent='Select a station from the list';search();});
 input.addEventListener('keydown',e=>{
  if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();if(list.hidden)search();index=Math.max(0,Math.min(options.length-1,index+(e.key==='ArrowDown'?1:-1)));list.querySelectorAll('.suggestion').forEach((b,i)=>{b.classList.toggle('focused',i===index);b.setAttribute('aria-selected',i===index);});if(options[index]){input.setAttribute('aria-activedescendant',`${field}-option-${index}`);$(`${field}-option-${index}`).scrollIntoView({block:'nearest'});}}
  if(e.key==='Enter'&&!list.hidden&&options.length){e.preventDefault();setStation(field,options[Math.max(index,0)].id);input.blur();}
  if(e.key==='Escape')closeSuggestions();
 });
 list.addEventListener('click',e=>{const b=e.target.closest('[data-station]');if(b){setStation(field,b.dataset.station);input.focus();closeSuggestions();}});
 input.addEventListener('blur',()=>setTimeout(()=>{if(!list.contains(document.activeElement)){list.hidden=true;input.setAttribute('aria-expanded','false');}},150));
}
document.addEventListener('click',e=>{if(!e.target.closest('.station-fields'))closeSuggestions();});
$('swap').addEventListener('click',()=>{[state.from,state.to]=[state.to,state.from];updateFields();if(state.from&&state.to)plan();});
document.querySelectorAll('[data-pref]').forEach(b=>b.addEventListener('click',()=>{state.preference=b.dataset.pref;updateFields();if(state.from&&state.to)plan();}));
$('airport').addEventListener('change',()=>{state.allowAirport=$('airport').checked;if(state.from&&state.to)plan();});
$('route-form').addEventListener('submit',e=>{e.preventDefault();plan();});
function setTab(tab){document.querySelector('.app-shell').dataset.tab=tab;document.querySelectorAll('[data-tab]').forEach(b=>{if(!b.matches('button'))return;const active=b.dataset.tab===tab;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('saved-panel').hidden=tab!=='saved';if(tab==='saved')renderSaved();if(matchMedia('(max-width:760px)').matches)window.scrollTo({top:0,behavior:reduceMotion.matches?'instant':'smooth'});}
document.querySelectorAll('.mobile-nav button').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
function showError(message){$('form-error').textContent=message;$('form-error').hidden=false;}
function plan({focus=true,announce=false}={}){
 if(!state.from||!state.to)return showError('Choose both stations from the search results.');
 const route=findRoute(state.from,state.to,state);
 if(!route){state.route=null;stopPlayback();renderMap();$('result').innerHTML='';return showError('No route with these preferences. Airport destinations need KLIA trains enabled.');}
 $('form-error').hidden=true;state.route=route;stopPlayback();state.elapsed=0;state.progress=0;renderResult();renderMap();if(focus&&route.edges.length)focusRoute();updatePlayback();
 const url=new URL(location.href);url.searchParams.set('from',state.from);url.searchParams.set('to',state.to);url.searchParams.set('mode',state.preference);url.searchParams.set('airport',String(state.allowAirport));history.replaceState(null,'',url);
 if(announce)toast('Your journey is ready.');
 if(route.edges.length&&!reduceMotion.matches&&!document.hidden)play();
}
function renderResult(){
 const r=state.route;if(!r)return;
 if(!r.edges.length){$('result').innerHTML=`<div class="section-heading"><h2>You’re already there.</h2></div><p class="same-station">${esc(name(r.from))} is both your departure and destination. Pick another station to explore.</p>`;return;}
 const rides=r.legs.filter(l=>l.type==='ride');
 $('result').innerHTML=`<div class="section-heading"><h2>Your journey</h2><span class="route-chip"><i></i>${state.preference==='transfers'?'Fewer transfers':'Estimated fastest'}</span></div><div class="journey-stats"><div><strong>~${r.minutes}<small>min</small></strong><span>Estimated journey</span></div><div><strong>${r.transfers}</strong><span>${r.transfers===1?'Transfer':'Transfers'}</span></div><div><strong>${r.stops}</strong><span>Stops travelled</span></div></div><div class="journey-lines">${r.legs.map(l=>l.type==='ride'?`<span class="line-badge" title="${esc(lineById[l.line].name)}" style="background:${lineById[l.line].color}">${lineById[l.line].number}</span>`:`<span class="route-separator" title="Walking connection">↗ walk</span>`).join('<span class="route-separator">→</span>')}</div><p class="estimate-note">Includes ${r.walkMinutes?`${r.walkMinutes} min estimated walking and `:''}transfer time. Excludes waiting, delays and operating hours.</p>${r.legs.map(l=>{
 if(l.type==='walk')return `<div class="journey-leg walking-leg"><div class="leg-head">Walk to ${esc(name(l.to))}<small>~${l.minutes} min</small></div><div class="leg-detail">Connecting station · ticket gates may be separate</div></div>`;
 const line=lineById[l.line];return `<div class="journey-leg" style="--leg-color:${line.color}"><div class="leg-head">${esc(name(l.from))}<small>${l.edges.length} ${l.edges.length===1?'stop':'stops'}</small></div><div class="leg-detail">${line.type} ${esc(line.name)} · towards ${esc(l.direction)}${l.transferMinutes?'<br>Allow ~4 min to change trains':''}${line.airport?'<br>Airport train · separate ticket required':''}</div><div class="leg-destination">Get off at ${esc(name(l.to))}</div><details><summary>Show all ${l.edges.length} stops</summary><ol>${l.edges.map(e=>`<li>${esc(name(e.to))}</li>`).join('')}</ol></details></div>`;
 }).join('')}<div class="arrival"><span class="arrival-dot"></span>Arrive at ${esc(name(r.to))}</div><div class="result-actions"><button id="save-journey">${icon('save')}Save journey</button><button id="share-journey">${icon('share')}Share route</button></div>`;
 $('save-journey').addEventListener('click',saveJourney);$('share-journey').addEventListener('click',shareJourney);
}
function saveJourney(){
 const entry={from:state.from,to:state.to,preference:state.preference,allowAirport:state.allowAirport};
 if(saved.some(s=>JSON.stringify(s)===JSON.stringify(entry)))return toast('This journey is already saved.');
 saved.unshift(entry);saved=saved.slice(0,20);try{localStorage.setItem('kvrailway.saved',JSON.stringify(saved));toast('Journey saved on this device.');}catch{saved.shift();toast('Your browser could not save this journey.');}renderSaved();
}
function renderSaved(){
 $('saved-count').textContent=saved.length;
 $('saved-list').innerHTML=saved.length?saved.map((s,i)=>`<div class="saved-item"><button data-load="${i}">${esc(name(s.from))} → ${esc(name(s.to))}<small>${s.preference==='transfers'?'Fewer transfers':'Estimated fastest'} · ${s.allowAirport?'Airport trains included':'No airport trains'}</small></button><button class="icon-button" data-remove="${i}" aria-label="Delete ${esc(name(s.from))} to ${esc(name(s.to))}">${icon('trash')}</button></div>`).join(''):'<p class="saved-empty">Your regular journeys, a tap away.<br>Plan a route and select “Save journey” to keep it here.</p>';
}
$('saved-list').addEventListener('click',e=>{const load=e.target.closest('[data-load]'),remove=e.target.closest('[data-remove]');if(load){Object.assign(state,saved[Number(load.dataset.load)]);updateFields();setTab('plan');plan();}if(remove){saved.splice(Number(remove.dataset.remove),1);try{localStorage.setItem('kvrailway.saved',JSON.stringify(saved));}catch{toast('Could not update saved journeys.');}renderSaved();}});
async function shareJourney(){
 const r=state.route;const text=`KV Railway: ${name(r.from)} → ${name(r.to)}\n~${r.minutes} min estimated · ${r.transfers} transfers\n\n${r.legs.map(l=>l.type==='walk'?`Walk: ${name(l.from)} → ${name(l.to)} (~${l.minutes} min)`:`${lineById[l.line].type} ${lineById[l.line].name}, towards ${l.direction}: ${name(l.from)} → ${name(l.to)} (${l.edges.length} stops)`).join('\n')}\n\nTimes exclude waiting and delays. Check operator schedules.\n${location.href}`;
 try{if(navigator.share)await navigator.share({title:'My KV Railway journey',text});else{await navigator.clipboard.writeText(text);toast('Route and link copied.');}}catch(error){if(error.name!=='AbortError')toast('Could not share. Copy the page link from your browser.');}
}
const svg=$('network-map'),viewport=$('map-viewport');
function pathFor(ids){return ids.map((id,i)=>`${i?'L':'M'}${stationById[id].x},${stationById[id].y}`).join(' ');}
function renderMap(){
 const routeIds=new Set(state.route?.edges.flatMap(e=>[e.from,e.to])||[]);const available=stations.filter(s=>s.status==='available'||state.future);
 $('line-layer').innerHTML=lines.filter(l=>l.status==='available'||state.future).map(l=>{
 const stops=state.future?l.stops:l.stops.filter(s=>s.status==='available');return `<path class="network-line ${l.status!=='available'?'unavailable':''}" data-line="${l.id}" d="${pathFor(stops.map(s=>s.station))}" stroke="${l.color}" ${l.id==='ag'?'transform="translate(1.3,0)"':l.id==='sp'?'transform="translate(-1.3,0)"':''}/>`;
 }).join('');
 $('walk-layer').innerHTML=walkingLinks.map(w=>`<path class="walk-connection" d="${pathFor([w.from,w.to])}"/>`).join('');
 $('station-layer').innerHTML=available.map(s=>`<g class="rail-station ${routeIds.has(s.id)?'on-route':''}" data-station="${s.id}" role="button" tabindex="0" aria-label="${esc(s.name)}${s.status!=='available'?', '+s.status:''}" transform="translate(${s.x},${s.y})"><title>${esc(s.name)} · ${esc(s.codes.join(' / '))}</title><circle class="station-hit" r="6"/><circle class="station-ring ${s.lines.filter(id=>lineById[id].status==='available').length>1?'interchange':''}" r="${s.lines.length>1?2.9:1.8}" ${s.status!=='available'?'opacity=".35"':''}/></g>`).join('');
 // Keep the overview legible; smaller labels appear as the map is enlarged.
 $('label-layer').innerHTML=available.map((s,i)=>{
 const isMajor=majorStations.has(s.id),onRoute=routeIds.has(s.id);const flip=s.x>490||(s.x>300&&s.x<335)||s.id==='gombak';const label=s.name.replace(/ \((MRT|LRT|KTM|Monorail)\)/,'');const offset=(onRoute&&!isMajor)?(i%2?7:-7):7;
 return `<text class="station-label ${isMajor?'major':'minor'} ${onRoute?'on-route':''}" x="${s.x+(flip?-5:5)}" y="${s.y+offset/2}" text-anchor="${flip?'end':'start'}">${esc(label)}</text>`;
 }).join('');
 $('route-layer').innerHTML=state.route?.edges.length?state.route.legs.map(l=>`<path class="route-halo" stroke="${l.line?lineById[l.line].color:'#748775'}" d="${pathFor([l.from,...l.edges.map(e=>e.to)])}"/><path class="route-path ${l.type==='walk'?'walk':''}" stroke="${l.line?lineById[l.line].color:'#748775'}" d="${pathFor([l.from,...l.edges.map(e=>e.to)])}"/>`).join('')+[state.route.from,state.route.to].map((id,i)=>{const s=stationById[id];return `<circle class="route-end" cx="${s.x}" cy="${s.y}" r="5.7"/><text class="route-end-label" x="${s.x}" y="${s.y+.4}">${i?'B':'A'}</text>`;}).join(''):'';
 viewport.classList.toggle('has-route',Boolean(state.route?.edges.length));
 $('train-marker').innerHTML='<circle r="8" fill="#fff" filter="url(#marker-shadow)"/><rect x="-4.1" y="-5.2" width="8.2" height="9.5" rx="2.6" fill="#203e46"/><path d="M-2.5 -2.7h5v2.6h-5z" fill="#d9f36d"/><circle cx="-1.9" cy="2.5" r=".6" fill="white"/><circle cx="1.9" cy="2.5" r=".6" fill="white"/>';
 $('train-marker').toggleAttribute('hidden',!state.route?.edges.length);setView(state.view);positionTrain(state.progress);
}
function setView(view){state.view=view;svg.setAttribute('viewBox',view.join(' '));viewport.classList.toggle('show-labels',view[2]<310);}
function bounds(ids){const pts=[...new Set(ids)].map(id=>stationById[id]);const xs=pts.map(s=>s.x),ys=pts.map(s=>s.y);let x=Math.min(...xs)-36,y=Math.min(...ys)-28,w=Math.max(...xs)-x+48,h=Math.max(...ys)-y+35;w=Math.max(130,w);h=Math.max(130,h);const ratio=viewport.clientWidth/viewport.clientHeight;if(w/h<ratio){const nw=h*ratio;x-=(nw-w)/2;w=nw;}else{const nh=w/ratio;y-=(nh-h)/2;h=nh;}return [x,y,w,h];}
function focusRoute(){if(state.route?.edges.length)setView(bounds(state.route.edges.flatMap(e=>[e.from,e.to])));}
function zoom(factor,point){const [x,y,w,h]=state.view;const nextW=Math.min(900,Math.max(85,w*factor)),actual=nextW/w;const p=point||{x:x+w/2,y:y+h/2};setView([p.x-(p.x-x)*actual,p.y-(p.y-y)*actual,nextW,h*actual]);}
$('zoom-in').addEventListener('click',()=>zoom(.75));$('zoom-out').addEventListener('click',()=>zoom(1.33));$('fit').addEventListener('click',()=>setView([40,90,540,580]));$('focus-route').addEventListener('click',focusRoute);
$('dimension').addEventListener('click',()=>{if(reduceMotion.matches)return toast('3D motion is disabled by your reduced-motion setting.');state.threeD=!state.threeD;viewport.classList.toggle('is-3d',state.threeD);$('dimension').setAttribute('aria-pressed',state.threeD);});
$('future').addEventListener('change',()=>{state.future=$('future').checked;renderMap();});
$('legend').innerHTML=lines.filter(l=>l.status==='available').map(l=>`<button data-line="${l.id}" title="Focus ${esc(l.name)}"><i style="background:${l.color}"></i>${l.type==='KTM'?`KTM ${l.number}`:l.name}</button>`).join('');
$('legend').addEventListener('click',e=>{const b=e.target.closest('[data-line]');if(!b)return;setView(bounds(lineById[b.dataset.line].stops.map(s=>s.station)));document.querySelectorAll('.legend button').forEach(el=>el.classList.toggle('active',el===b));});
let moved=false;const pointers=new Map();let panStart,pinchStart;
function svgPoint(x,y){const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(svg.getScreenCTM().inverse());}
svg.addEventListener('pointerdown',e=>{if(e.button>0)return;moved=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});svg.setPointerCapture(e.pointerId);if(pointers.size===1)panStart={point:svgPoint(e.clientX,e.clientY),view:[...state.view],x:e.clientX,y:e.clientY};if(pointers.size===2){const [a,b]=[...pointers.values()];pinchStart=Math.hypot(a.x-b.x,a.y-b.y);}});
svg.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){moved=true;const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinchStart>0)zoom(pinchStart/distance,svgPoint((a.x+b.x)/2,(a.y+b.y)/2));pinchStart=distance;}else if(panStart){if(Math.hypot(e.clientX-panStart.x,e.clientY-panStart.y)>5)moved=true;const p=svgPoint(e.clientX,e.clientY);const v=state.view;setView([v[0]+panStart.point.x-p.x,v[1]+panStart.point.y-p.y,v[2],v[3]]);}});
function endPointer(e){pointers.delete(e.pointerId);if(!moved&&e.type==='pointerup'){const p=svgPoint(e.clientX,e.clientY);const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-station]');if(hit)showStation(hit.dataset.station);else{const nearest=stations.filter(s=>s.status==='available'||state.future).map(s=>({s,d:Math.hypot(s.x-p.x,s.y-p.y)})).sort((a,b)=>a.d-b.d)[0];if(nearest&&nearest.d<5)showStation(nearest.s.id);else $('station-popover').hidden=true;}}panStart=null;pinchStart=null;}
svg.addEventListener('pointerup',endPointer);svg.addEventListener('pointercancel',endPointer);svg.addEventListener('lostpointercapture',e=>pointers.delete(e.pointerId));
svg.addEventListener('keydown',e=>{const g=e.target.closest('[data-station]');if(g&&['Enter',' '].includes(e.key)){e.preventDefault();showStation(g.dataset.station);}});
svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.1:.9,svgPoint(e.clientX,e.clientY));},{passive:false});
function showStation(id){const s=stationById[id];$('station-popover').innerHTML=`<button class="popover-close" aria-label="Close station">${icon('close')}</button><strong>${esc(s.name)}</strong><small>${esc(s.codes.join(' · '))}</small>${s.status==='available'?'<div class="popover-actions"><button data-set="from">Start here</button><button data-set="to">Go here</button></div>':`<p>${s.status==='planned'?'Planned station. Not included in journey planning.':'Service suspended. Not included in journey planning.'}</p>`}`;$('station-popover').hidden=false;$('station-popover').querySelector('.popover-close').onclick=()=>$('station-popover').hidden=true;$('station-popover').querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>{setStation(b.dataset.set,id);$('station-popover').hidden=true;setTab('plan');if(state.from&&state.to)plan();});}
function stopPlayback(){cancelAnimationFrame(state.frame);state.playing=false;$('play').innerHTML=icon('play');$('play').setAttribute('aria-label','Play journey animation');}
function positionTrain(progress){const r=state.route;if(!r?.edges.length)return;const lengths=r.edges.map(e=>{const a=stationById[e.from],b=stationById[e.to];return Math.hypot(a.x-b.x,a.y-b.y);});const total=lengths.reduce((a,b)=>a+b,0);let at=Math.min(progress,.999999)*total,i=0;while(i<lengths.length-1&&at>lengths[i])at-=lengths[i++];const edge=r.edges[i],a=stationById[edge.from],b=stationById[edge.to],t=at/(lengths[i]||1);$('train-marker').setAttribute('transform',`translate(${a.x+(b.x-a.x)*t},${a.y+(b.y-a.y)*t})`);$('playback-title').textContent=progress>=1?`Arrived at ${name(r.to)}`:`${name(edge.from)} → ${name(edge.to)}`;$('playback-subtitle').textContent=progress>=1?'Preview complete · not live tracking':edge.type==='walk'?'Walk to the connecting station':`${lineById[edge.line].type} ${lineById[edge.line].name} · route preview`;$('playback-progress').style.width=`${progress*100}%`;}
function updatePlayback(){const valid=Boolean(state.route?.edges.length);$('play').disabled=!valid||reduceMotion.matches;$('replay').disabled=!valid||reduceMotion.matches;positionTrain(state.progress);if(!valid){$('playback-title').textContent='Choose a journey';$('playback-subtitle').textContent='Follow your route through the city';$('playback-progress').style.width='0%';}if(reduceMotion.matches)$('playback-subtitle').textContent='Static preview · reduced motion enabled';}
function play(){if(!state.route?.edges.length||reduceMotion.matches)return;if(state.playing){stopPlayback();return;}if(state.progress>=1){state.progress=0;state.elapsed=0;}state.playing=true;$('play').innerHTML=icon('pause');$('play').setAttribute('aria-label','Pause journey animation');const duration=Math.min(45000,Math.max(13000,state.route.edges.length*950));let last=performance.now();function step(now){if(!state.playing)return;state.elapsed+=Math.min(100,now-last);last=now;state.progress=Math.min(1,state.elapsed/duration);positionTrain(state.progress);if(state.progress>=1)stopPlayback();else state.frame=requestAnimationFrame(step);}state.frame=requestAnimationFrame(step);}
$('play').addEventListener('click',play);$('replay').addEventListener('click',()=>{stopPlayback();state.elapsed=0;state.progress=0;positionTrain(0);play();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback();});reduceMotion.addEventListener('change',()=>{stopPlayback();state.threeD=false;viewport.classList.remove('is-3d');$('dimension').setAttribute('aria-pressed','false');updatePlayback();});
for(const id of ['about-button','source-button'])$(id).onclick=()=>$('about').showModal();$('close-about').onclick=()=>$('about').close();$('about').addEventListener('click',e=>{if(e.target===$('about')){const r=$('about').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('about').close();}});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install-button').hidden=false;});$('install-button').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();const result=await installPrompt.userChoice;if(result.outcome==='accepted')$('install-button').hidden=true;installPrompt=null;};window.addEventListener('appinstalled',()=>{$('install-button').hidden=true;toast('KV Railway is installed.');});
let offlineReady=false;function connection(){const t=$('connection').querySelector('span');t.textContent=navigator.onLine?(offlineReady?'Ready for offline journeys':'Offline-ready planner'):(offlineReady?'Offline · planner available':'You’re offline');$('connection').querySelector('i').style.background=navigator.onLine?'#75965a':'#d69521';}
window.addEventListener('online',connection);window.addEventListener('offline',connection);
if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').then(reg=>{navigator.serviceWorker.ready.then(()=>{offlineReady=true;connection();});reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)toast('A new version is ready. Close and reopen the app to update.');});});}).catch(()=>{connection();});}
const params=new URLSearchParams(location.search);for(const f of ['from','to']){const id=params.get(f);if(id&&stationById[id]?.status==='available')state[f]=id;}if(params.get('mode')==='transfers')state.preference='transfers';if(params.get('airport')==='true')state.allowAirport=true;
updateFields();setTab('plan');plan();connection();
