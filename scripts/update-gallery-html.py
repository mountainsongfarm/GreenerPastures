#!/usr/bin/env python3
"""Transform gallery/index.html img tags to optimized picture markup."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GALLERY = ROOT / "gallery" / "index.html"

IMG_RE = re.compile(
    r'<img src="/images/([^"]+)" alt="([^"]*)"( loading="[^"]*")?( fetchpriority="[^"]*")? decoding="async">'
)


def stem(filename: str) -> str:
    return Path(filename).stem


def carousel_replacer(match: re.Match) -> str:
    filename, alt, loading, fetchpriority = match.groups()
    loading = loading or ' loading="lazy"'
    fetchpriority = fetchpriority or ""
    webp = f"/images/webp/{stem(filename)}.webp"
    return f'''<picture>
                            <source type="image/webp" srcset="{webp}">
                            <img src="/images/{filename}" alt="{alt}"{loading}{fetchpriority} decoding="async" data-full-jpg="/images/{filename}" data-full-webp="{webp}">
                        </picture>'''


def grid_item_html(filename: str, alt: str, index: int) -> str:
    s = stem(filename)
    loading = 'loading="eager"' if index < 6 else 'loading="lazy"'
    return f'''                        <div class="grid-item" style="background-image: url('/images/blur/{s}.jpg')">
                            <picture>
                                <source type="image/webp" srcset="/images/thumbs/{s}.webp">
                                <img src="/images/thumbs/{s}.jpg" alt="{alt}" {loading} decoding="async" class="grid-photo" data-full-jpg="/images/{filename}" data-full-webp="/images/webp/{s}.webp">
                            </picture>
                        </div>'''


def transform_section(html: str, start_marker: str, end_marker: str, transform) -> str:
    start = html.index(start_marker)
    end = html.index(end_marker, start)
    section = html[start:end]
    return html[:start] + transform(section) + html[end:]


def transform_carousel_section(section: str) -> str:
    return IMG_RE.sub(carousel_replacer, section)


def transform_grid_section(section: str) -> str:
    items = IMG_RE.findall(section)
    lines = [grid_item_html(filename, alt, i) for i, (filename, alt, _, _) in enumerate(items)]
    inner = "\n".join(lines)
    return f'<div class="image-grid">\n{inner}\n                    '


def main():
    html = GALLERY.read_text()
    html = transform_section(
        html,
        '<div class="large-carousel-track">',
        '</div>\n                    <button class="large-carousel-button prev">',
        transform_carousel_section,
    )
    html = transform_section(
        html,
        '<div class="image-grid">',
        '</div>\n                </div>\n            </section>\n        </div>\n    </main>',
        transform_grid_section,
    )
    GALLERY.write_text(html)
    print("Gallery HTML updated.")


if __name__ == "__main__":
    main()
