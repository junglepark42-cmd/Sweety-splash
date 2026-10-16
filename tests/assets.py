from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
for name in json.loads((root/'runtime-files.json').read_text()):
 assert (root/name).is_file(),name
for name in ['unicorn','dino']:
 im=Image.open(root/f'assets/{name}.png'); assert im.mode=='RGBA'
 alpha=im.getchannel('A'); assert alpha.getextrema()==(0,255)
 box=alpha.getbbox(); assert box[0]>0 and box[1]>0 and box[2]<im.width and box[3]<im.height,(name,box)
 assert alpha.histogram()[0]>im.width*im.height*.2
 print('PASS transparent complete mascot',name,im.size,box)
print('PASS all runtime resources exist')
