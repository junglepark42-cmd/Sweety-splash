from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
root=Path(__file__).resolve().parents[1]
for size in [192,512]:
 im=Image.new('RGB',(size,size),'#fff8ed');d=ImageDraw.Draw(im)
 for x,y,r,c in [(.38,.36,.27,'#f64c96'),(.64,.45,.24,'#338ee9'),(.48,.64,.25,'#ffd644')]:
  d.ellipse(((x-r)*size,(y-r)*size,(x+r)*size,(y+r)*size),fill=c)
 for x,y,r,c in [(.15,.2,.04,'#f64c96'),(.85,.3,.045,'#338ee9'),(.76,.83,.04,'#ffd644'),(.2,.8,.035,'#9a65cb')]:d.ellipse(((x-r)*size,(y-r)*size,(x+r)*size,(y+r)*size),fill=c)
 im.save(root/f'assets/icon-{size}.png',optimize=True)
manifest={'name':'Sweety Splash — La bataille des couleurs','short_name':'Sweety Splash','id':'./','start_url':'./','scope':'./','display':'fullscreen','orientation':'landscape','background_color':'#fff8ed','theme_color':'#f5e9dc','lang':'fr','description':'Éclabousse, mélange les couleurs et garde ton tableau en souvenir.','icons':[{'src':f'./assets/icon-{s}.png','sizes':f'{s}x{s}','type':'image/png'} for s in [192,512]]}
(root/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
files=['index.html','manifest.webmanifest','css/splash.css']+[str(p.relative_to(root)) for p in sorted((root/'js').glob('*.js'))]+[str(p.relative_to(root)) for p in sorted((root/'assets').iterdir()) if p.suffix in ['.png','.webp','.woff']]
version=hashlib.sha256(b''.join((root/p).read_bytes() for p in files)).hexdigest()[:16]
sw="""const CACHE='sweety-splash-__VERSION__';
const FILES=__FILES__;
async function fetchAndCache(cache,path){let error;for(let attempt=0;attempt<3;attempt++){try{const url=new URL(path,self.registration.scope),response=await fetch(new Request(url,{cache:'reload'}));if(!response.ok)throw Error(response.status+' '+path);await cache.put(url,response);return}catch(e){error=e;await new Promise(r=>setTimeout(r,300*(attempt+1)))}}throw error}
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(CACHE),queue=[...FILES];await Promise.all(Array.from({length:3},async()=>{while(queue.length)await fetchAndCache(cache,queue.shift())}))}catch(e){await caches.delete(CACHE);throw e}})()));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sweety-splash-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;event.respondWith(caches.open(CACHE).then(async cache=>{const key=event.request.mode==='navigate'?new URL('./index.html',self.registration.scope):new URL(url.pathname,self.location.origin);return(await cache.match(key))||fetch(event.request)}))});
""".replace('__VERSION__',version).replace('__FILES__',json.dumps(['./']+['./'+p for p in files]))
(root/'service-worker.js').write_text(sw)
(root/'runtime-files.json').write_text(json.dumps(files,indent=2)+'\n')
print('Cache',version,'files',len(files),'bytes',sum((root/p).stat().st_size for p in files))
