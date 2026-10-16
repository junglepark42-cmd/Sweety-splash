(function(){'use strict';
class SplashAudio{
 constructor(enabled){this.enabled=enabled;this.ctx=null;this.note=0;this.next=0}
 unlock(){if(!this.enabled)return;try{this.ctx??=new(window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume()}catch(e){}}
 set(on){this.enabled=on;if(!on&&this.ctx)this.ctx.suspend();else this.unlock()}
 tone(f,d=.12,v=.04,delay=0){if(!this.enabled||!this.ctx||this.ctx.state!=='running')return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+d+.01)}
 effect(kind,matched=true){if(kind==='splash'){this.tone(140,.06,.025);return}if(kind==='hit'){this.tone(matched?784:440,.12,.055);if(matched)this.tone(1046,.12,.04,.06)}if(kind==='mix')[523,659,784].forEach((f,i)=>this.tone(f,.2,.045,i*.08));if(kind==='end')[523,659,784,1046].forEach((f,i)=>this.tone(f,.36,.06,i*.14))}
 music(active){if(!active||!this.enabled||!this.ctx)return;const t=this.ctx.currentTime;if(t<this.next)return;this.next=t+.34;const melody=[659,784,1046,784,698,880,1174,880,659,784,988,784,587,698,784,0],f=melody[this.note++%melody.length];if(f)this.tone(f,.25,.012)}
}
window.SplashAudio=SplashAudio;
})();
