// Page zoom stays locked; map gestures change only its SVG viewBox.
export function zoomView(view,factor,point,{min=85,max=900}={}){
 const [x,y,w,h]=view;if(!Number.isFinite(factor)||factor<=0)return [...view];
 const width=Math.max(min,Math.min(max,w*factor)),actual=width/w;
 const p=point||{x:x+w/2,y:y+h/2};return [p.x-(p.x-x)*actual,p.y-(p.y-y)*actual,width,h*actual];
}
export function installPageZoomGuard(doc=document){
 for(const type of ['gesturestart','gesturechange','gestureend'])doc.addEventListener(type,e=>e.preventDefault(),{passive:false});
 doc.addEventListener('touchmove',e=>{if(e.touches.length>1&&!e.target.closest('#map-viewport, [data-map-viewport]'))e.preventDefault();},{passive:false});
 doc.addEventListener('wheel',e=>{if((e.ctrlKey||e.metaKey)&&!e.target.closest('#map-viewport, [data-map-viewport]'))e.preventDefault();},{passive:false});
 doc.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['+','=','-','0'].includes(e.key))e.preventDefault();});
}
