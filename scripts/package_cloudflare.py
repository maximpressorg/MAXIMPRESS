"""Package the primary website without changing the supplied portfolio video."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

source = Path(__file__).resolve().parent.parent / 'site'
target = source.parent / 'MaxImpress_Cloudflare_Upload.zip'
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    for file in source.rglob('*'):
        if file.is_file() and file.name != 'maximpress-portfolio-video.mp4':
            archive.write(file, file.relative_to(source))
    archive.writestr('_redirects', '/maximpress-portfolio-video.mp4 https://maximpressorg.github.io/MAXIMPRESS/maximpress-portfolio-video.mp4 302\n')
print(target)
