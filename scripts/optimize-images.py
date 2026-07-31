#!/usr/bin/env python3
"""Optimize site images: compress originals, create WebP, thumbs (EXIF-aware)."""

import subprocess
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
WEBP_DIR = IMAGES / "webp"
THUMBS_DIR = IMAGES / "thumbs"

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

BACKGROUND_ONLY = ["Stable.jpeg"]

HERO_DESKTOP = "Barn Rainbow.jpg"
HERO_MOBILE = "Barn Rainbow-mobile.jpg"


def load_oriented(path: Path) -> Image.Image:
    with Image.open(path) as im:
        return ImageOps.exif_transpose(im).convert("RGB")


def resize_max(im: Image.Image, max_dim: int) -> Image.Image:
    w, h = im.size
    if max(w, h) <= max_dim:
        return im.copy()
    scale = max_dim / max(w, h)
    return im.resize((round(w * scale), round(h * scale)), Image.Resampling.LANCZOS)


def save_jpeg(im: Image.Image, path: Path, quality: int):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "JPEG", quality=quality, optimize=True)


def to_webp(src: Path, dst: Path, quality: int = 82):
    dst.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["cwebp", "-q", str(quality), str(src), "-o", str(dst)], check=True, capture_output=True)


def stem_for(filename: str) -> str:
    return Path(filename).stem


def webp_name(filename: str) -> str:
    return stem_for(filename) + ".webp"


def bake_exif_if_needed(path: Path, quality: int = 92) -> bool:
    """Write orientation-corrected pixels to source file when EXIF rotation is present."""
    with Image.open(path) as raw:
        exif = raw.getexif()
        orient = exif.get(274, 1) if exif else 1
        if orient == 1:
            return False
        corrected = ImageOps.exif_transpose(raw).convert("RGB")
    save_jpeg(corrected, path, quality)
    print(f"  EXIF baked: {path.name}")
    return True


def main():
    for d in (WEBP_DIR, THUMBS_DIR):
        d.mkdir(parents=True, exist_ok=True)

    all_images = list(dict.fromkeys(GALLERY_IMAGES + BACKGROUND_ONLY))

    hero_src = IMAGES / HERO_DESKTOP
    if hero_src.exists():
        hero = load_oriented(hero_src)
        save_jpeg(resize_max(hero, 1920), hero_src, 75)
        to_webp(hero_src, WEBP_DIR / webp_name(HERO_DESKTOP))
        mobile_path = IMAGES / HERO_MOBILE
        save_jpeg(resize_max(load_oriented(hero_src), 1200), mobile_path, 75)
        to_webp(mobile_path, WEBP_DIR / webp_name(HERO_MOBILE))
        thumb_path = THUMBS_DIR / (stem_for(HERO_DESKTOP) + ".jpg")
        save_jpeg(resize_max(load_oriented(hero_src), 400), thumb_path, 78)
        to_webp(thumb_path, THUMBS_DIR / webp_name(HERO_DESKTOP), 78)
        print(f"Hero: {hero_src.stat().st_size/1024:.0f} KB, mobile {mobile_path.stat().st_size/1024:.0f} KB")

    for name in all_images:
        if name == HERO_DESKTOP:
            continue
        src = IMAGES / name
        if not src.exists():
            print(f"SKIP missing: {name}", file=sys.stderr)
            continue

        bake_exif_if_needed(src)
        im = load_oriented(src)
        full = resize_max(im, 1600)
        save_jpeg(full, src, 82)
        to_webp(src, WEBP_DIR / webp_name(name))

        thumb_path = THUMBS_DIR / (stem_for(name) + ".jpg")
        save_jpeg(resize_max(im, 400), thumb_path, 78)
        to_webp(thumb_path, THUMBS_DIR / webp_name(name), 78)

        print(f"  {name}: {src.stat().st_size/1024:.0f} KB, thumb {thumb_path.stat().st_size/1024:.0f} KB")

    print("Done.")


if __name__ == "__main__":
    main()
