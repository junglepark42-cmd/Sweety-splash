(function(root){'use strict';
const COLORS=[{id:'pink',name:'Rose',hex:'#f64c96'},{id:'yellow',name:'Jaune',hex:'#ffd644'},{id:'blue',name:'Bleu',hex:'#338ee9'},{id:'green',name:'Vert',hex:'#71c950'},{id:'orange',name:'Orange',hex:'#ff9248'},{id:'purple',name:'Violet',hex:'#9a65cb'}];
const byId=id=>COLORS.find(c=>c.id===id);
function mix(a,b){if(a===b)return{...byId(a),mixed:false};const key=[a,b].sort().join('+'),id={'blue+yellow':'green','pink+yellow':'orange','blue+pink':'purple'}[key];if(id)return{...byId(id),mixed:true};return{id:'brown',name:'Terre de couleurs',hex:'#9c7959',mixed:true}}
class Round{
 constructor(mode='challenge'){this.mode=mode;this.time=0;this.duration=120;this.phase='play';this.paused=false;this.score=0;this.hits=0;this.matches=0;this.combo=0;this.comboUntil=0;this.balloons=3;this.targets=[];this.spawnAt=.35;this.seed=61426;this.serial=0;this.events=[]}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296}
 get remaining(){return Math.max(0,this.duration-this.time)}
 get finale(){return this.mode==='challenge'&&this.remaining<=10}
 get roller(){return this.mode==='free'||this.hits>=8||this.finale}
 step(dt){if(this.paused||this.phase!=='play')return;this.time+=Math.max(0,dt);if(this.mode==='free')return;if(this.time>=this.duration){this.time=this.duration;this.phase='end';this.events.push({type:'end'});return}if(this.time>this.comboUntil)this.combo=0;
 for(const t of this.targets){t.life-=dt;t.x=t.baseX+Math.sin(this.time*1.2+t.phase)*t.sway}
 this.targets=this.targets.filter(t=>!t.used&&t.life>0);
 if(this.time>=this.spawnAt&&this.targets.length<7){this.spawn();this.spawnAt=this.time+(this.finale?.65:this.time>45?1.1:1.5)}
 }
 spawn(){const radius=41+this.random()*7;let x,y;for(let attempt=0;attempt<20;attempt++){x=75+this.random()*1050;y=115+this.random()*230;if(this.targets.every(t=>Math.hypot(t.x-x,t.y-y)>115))break}const c=COLORS[Math.floor(this.random()*COLORS.length)];this.targets.push({id:++this.serial,color:c.id,x,baseX:x,y,r:radius,kind:['balloon','star','monster'][this.serial%3],life:this.time>45?6:8,sway:this.time>30?16:0,phase:this.random()*7,used:false})}
 canUse(tool){return tool==='roller'?this.roller:tool==='balloon'?this.mode==='free'||this.finale||this.balloons>0:true}
 paint(x,y,color,tool='brush',from=null,consume=true){if(this.paused||this.phase!=='play'||!this.canUse(tool))return[];if(consume&&tool==='balloon'&&this.mode!=='free'&&!this.finale)this.balloons--;
 if(this.mode==='free')return[];
 const radius=tool==='balloon'?86:tool==='roller'?30:18,hits=[];
 for(const t of this.targets){if(t.used)continue;let px=x,py=y;if(from){const dx=x-from.x,dy=y-from.y,len=dx*dx+dy*dy;const u=len?Math.max(0,Math.min(1,((t.x-from.x)*dx+(t.y-from.y)*dy)/len)):0;px=from.x+u*dx;py=from.y+u*dy}if(Math.hypot(t.x-px,t.y-py)>t.r+radius)continue;
 t.used=true;this.hits++;const matched=t.color===color.id;if(matched){this.matches++;this.combo=this.time<=this.comboUntil?this.combo+1:1;this.comboUntil=this.time+2.8}else this.combo=0;
 const points=(matched?(color.mixed?120:80):25)+(matched?Math.min(10,this.combo)*5:0);this.score+=points;
 if(this.hits%5===0)this.balloons=Math.min(5,this.balloons+1);
 const hit={type:'hit',x:t.x,y:t.y,matched,points,color:t.color};hits.push(hit);this.events.push(hit);
 }return hits;
 }
 drain(){return this.events.splice(0)}
}
const api={COLORS,byId,mix,Round};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SplashCore=api;
})(typeof window==='undefined'?globalThis:window);
