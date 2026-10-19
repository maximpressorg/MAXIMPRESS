from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path


OLD_ORIGIN = "https://maximpress.pages.dev"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare the verified MaxImpress site for Firebase Hosting.")
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--project", required=True)
    parser.add_argument("--site", required=True)
    args = parser.parse_args()

    source = args.source.resolve()
    output = args.output.resolve()
    public = output / "public"
    new_origin = f"https://{args.site}.web.app"

    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(source, public)

    changed = []
    for path in public.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".xml", ".txt"}:
            continue
        data = path.read_bytes()
        revised = data.replace(OLD_ORIGIN.encode(), new_origin.encode())
        if revised != data:
            path.write_bytes(revised)
            changed.append(path.relative_to(public).as_posix())

    firebase_config = {
        "hosting": {
            "site": args.site,
            "public": "public",
            "cleanUrls": True,
            "trailingSlash": False,
            "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
            "headers": [
                {
                    "source": "**/*.@(css|js)",
                    "headers": [{"key": "Cache-Control", "value": "public,max-age=3600"}],
                },
                {
                    "source": "**/*.@(png|jpg|jpeg|webp|svg|ico|mp4)",
                    "headers": [{"key": "Cache-Control", "value": "public,max-age=86400"}],
                },
            ],
        }
    }
    (output / "firebase.json").write_text(json.dumps(firebase_config, indent=2) + "\n", encoding="utf-8")
    (output / ".firebaserc").write_text(
        json.dumps({"projects": {"default": args.project}}, indent=2) + "\n", encoding="utf-8"
    )

    protected = ["index.html", "services.html", "client-story.html"]
    for relative in protected:
        src = (source / relative).read_text(encoding="utf-8")
        dst = (public / relative).read_text(encoding="utf-8")
        if dst.replace(new_origin, OLD_ORIGIN) != src:
            raise SystemExit(f"Unexpected content change in protected file: {relative}")

    remaining = []
    for path in public.rglob("*"):
        if path.is_file() and OLD_ORIGIN.encode() in path.read_bytes():
            remaining.append(path.relative_to(public).as_posix())
    if remaining:
        raise SystemExit(f"Old origin remains in: {remaining}")

    manifest = {
        "source": str(source),
        "origin": new_origin,
        "project": args.project,
        "site": args.site,
        "fileCount": sum(1 for p in public.rglob("*") if p.is_file()),
        "changedOnlyForOrigin": changed,
        "protectedHashes": {name: digest(public / name) for name in protected},
    }
    (output / "migration-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
