from pathlib import Path
import shutil
source=Path("site")
destination=Path("_site")
shutil.copytree(source,destination,dirs_exist_ok=True)
for p in destination.glob("*.html"):
    text=p.read_bytes().replace(b'content="index,follow,max-image-preview:large"',b'content="noindex,follow"')
    p.write_bytes(text)
# Cloudflare is the primary search destination. This mirror remains navigable.
