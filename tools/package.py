from pathlib import Path
import json,shutil
root=Path(__file__).resolve().parents[1]
out=root/'dist'
if out.exists():shutil.rmtree(out)
for name in json.loads((root/'runtime-files.json').read_text())+['service-worker.js']:
 target=out/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(root/name,target)
(out/'.nojekyll').touch()
print('Packaged',len(list(out.rglob('*'))),'entries')
