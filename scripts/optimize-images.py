#!/usr/bin/env python3
"""Optimize site images: compress originals, create WebP, thumbs, and blur placeholders."""

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
WEBP_DIR = IMAGES / "webp"
THUMBS_DIR = IMAGES / "thumbs"
BLUR_DIR = IMAGES / "blur"

GALLERY_IMAGES = [
    "Birdseye.jpg",
    "Barn Rainbow.jpg",
    "BarnOUTDOOR.jpg",
    "Barn.jpg",
    "Barn Garden.jpeg",
    "Horse.jpg",
    "Tess_Horse.jpg",
    "Dusk.jpg",
    "BarnNew1.jpg",
    "BarnNew2.jpg",
    "Grazing.jpg",
    "Pastures.jpg",
    "Saying Hi.jpg",
    "Two Horses Laying.jpg",
    "E287CACF-CAAA-4E40-AB49-EC5FA0C34F20.jpg",
    "FDEC18B0-3D06-4EFD-A7B2-69B035036CF6.jpg",
    "Barn Pond.jpg",
    "Stall.jpg",
    "Meadow.jpg",
    "Horses Meadow.jpg",
    "Grazing meadow.jpg",
    "Fog Horse.jpg",
    "Eloise.jpg",
    "Snacking.jpg",
    "Bear Meadow.jpg",
    "Horseback Driveway.jpg",
    "2BEB85D4-9BA8-4AB5-8813-AB42E822F245.jpg",
    "Winter Horses HQ.jpg",
    "Winter Pastures.jpg",
    "Snow Sunset.jpg",
    "Winter Barn Lights.jpg",
    "Winter Night Sky.jpg",
    "Grazing Winter.jpg",
    "Winter Glamour.jpg",
    "Frozen Jacket.jpg",
    "Red Jacket.jpg",
    "Snow Writing.jpg",
    "Winter Riding Ring.jpg",
    "Barn Snow 2.jpeg",
    "Wreath.jpg",
]

BACKGROUND_ONLY = [
    "Stable.jpeg",
]

HERO_DESKTOP = "Barn Rainbow.jpg"
HERO_MOBILE = "Barn Rainbow-mobile.jpg"


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def file_size(path):
    return path.stat().st_size if path.exists() else 0


def optimize_jpeg(src: Path, dst: Path, max_dim: int, quality: int = 80, force: bool = False):
    """Resize and compress a JPEG/JPEG-like image. Keeps original if larger unless force=True."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = dst.with_suffix(dst.suffix + ".tmp.jpg")
    shutil.copy2(src, tmp)
    run(["sips", "-Z", str(max_dim), str(tmp)])
    run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", str(quality), str(tmp)])

    src_size = file_size(src) if src.exists() else 0
    tmp_size = file_size(tmp)
    if force or not dst.exists() or tmp_size < src_size or dst.resolve() != src.resolve():
        shutil.move(str(tmp), str(dst))
    else:
        tmp.unlink()
        if dst.resolve() != src.resolve() and src.exists():
            shutil.copy2(src, dst)


def to_webp(src: Path, dst: Path, quality: int = 82):
    dst.parent.mkdir(parents=True, exist_ok=True)
    run(["cwebp", "-q", str(quality), str(src), "-o", str(dst)])


def stem_for(filename: str) -> str:
    return Path(filename).stem


def webp_name(filename: str) -> str:
    return stem_for(filename) + ".webp"


def main():
    for d in (WEBP_DIR, THUMBS_DIR, BLUR_DIR):
        d.mkdir(parents=True, exist_ok=True)

    all_images = list(dict.fromkeys(GALLERY_IMAGES + BACKGROUND_ONLY))
    total_before = 0
    total_after = 0

    # Hero desktop: max 1920px
    hero_src = IMAGES / HERO_DESKTOP
    if hero_src.exists():
        before = file_size(hero_src)
        optimize_jpeg(hero_src, hero_src, max_dim=1920, quality=75, force=True)
        to_webp(hero_src, WEBP_DIR / webp_name(HERO_DESKTOP))
        optimize_jpeg(hero_src, IMAGES / HERO_MOBILE, max_dim=1200, quality=75, force=True)
        to_webp(IMAGES / HERO_MOBILE, WEBP_DIR / webp_name(HERO_MOBILE))
        optimize_jpeg(hero_src, BLUR_DIR / HERO_DESKTOP, max_dim=32, quality=40)
        total_before += before
        total_after += file_size(hero_src)
        print(f"Hero: {before/1024/1024:.2f} MB -> {file_size(hero_src)/1024/1024:.2f} MB")

    for name in all_images:
        if name == HERO_DESKTOP:
            continue
        src = IMAGES / name
        if not src.exists():
            print(f"SKIP missing: {name}", file=sys.stderr)
            continue

        before = file_size(src)
        total_before += before

        # Full-size: cap at 1600px, quality 80
        optimize_jpeg(src, src, max_dim=1600, quality=75)
        to_webp(src, WEBP_DIR / webp_name(name))

        # Thumbnail for grid (~400px)
        thumb_jpg = THUMBS_DIR / (stem_for(name) + ".jpg")
        optimize_jpeg(src, thumb_jpg, max_dim=400, quality=78)
        to_webp(thumb_jpg, THUMBS_DIR / webp_name(name), quality=78)

        # Blur placeholder (~32px)
        blur_jpg = BLUR_DIR / (stem_for(name) + ".jpg")
        optimize_jpeg(src, blur_jpg, max_dim=32, quality=40)

        after = file_size(src)
        total_after += after
        print(f"  {name}: {before/1024:.0f} KB -> {after/1024:.0f} KB")

    print(f"\nFull-size total (excl. hero counted once): {total_before/1024/1024:.1f} MB -> {total_after/1024/1024:.1f} MB")
    print("Done.")


if __name__ == "__main__":
    main()
