// Playback time advances only while the map is visible. Visibility pauses do
// not erase position or a user's deliberate Pause; manual Play is always allowed.
export function createPlayback({requestFrame,cancelFrame,onProgress=()=>{},onState=()=>{}}){
 let duration=0,elapsed=0,visible=false,wantsPlay=false,frame=null,lastTime=null,running=false;
 const snapshot=()=>({hasRoute:duration>0,progress:duration?Math.min(1,elapsed/duration):0,playing:running,wantsPlay,complete:duration>0&&elapsed>=duration});
 function cancel(){if(frame!==null)cancelFrame(frame);frame=null;lastTime=null;running=false;}
 function emit(){onState(snapshot());}
 function tick(time){frame=null;if(!visible||!wantsPlay||!duration)return;
  if(lastTime!==null)elapsed+=Math.max(0,time-lastTime);lastTime=time;
  if(elapsed>=duration){elapsed=duration;wantsPlay=false;running=false;lastTime=null;onProgress(1);emit();return;}
  onProgress(elapsed/duration);frame=requestFrame(tick);
 }
 function sync(){const next=visible&&wantsPlay&&duration>0&&elapsed<duration;
  if(!next)cancel();else if(!running){running=true;lastTime=null;frame=requestFrame(tick);}emit();
 }
 return {
  get state(){return snapshot();},
  load(nextDuration,{autoplay=true}={}){cancel();duration=Number.isFinite(nextDuration)&&nextDuration>0?nextDuration:0;elapsed=0;wantsPlay=Boolean(duration&&autoplay);onProgress(0);sync();},
  setVisible(next){visible=Boolean(next);sync();},
  play({restart=false}={}){if(!duration)return;if(restart||elapsed>=duration)elapsed=0;wantsPlay=true;onProgress(elapsed/duration);sync();},
  pause(){wantsPlay=false;sync();},
  toggle(){if(wantsPlay)this.pause();else this.play();},
  destroy(){wantsPlay=false;cancel();}
 };
}
export function mapIsVisible(rect,{viewportHeight,viewportWidth,bottomInset=0,pageHidden=false,modalOpen=false}={}){
 if(pageHidden||modalOpen||rect.width<=0||rect.height<=0)return false;
 const usableHeight=Math.max(0,viewportHeight-bottomInset);
 const height=Math.max(0,Math.min(rect.bottom,usableHeight)-Math.max(rect.top,0));
 const width=Math.max(0,Math.min(rect.right,viewportWidth)-Math.max(rect.left,0));
 return height>=Math.min(rect.height,usableHeight)*.15&&width>=Math.min(rect.width,viewportWidth)*.15;
}
