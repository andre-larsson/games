"""Make a hub cover image: crop to 16:9, resize to 1040x585, save as WebP.

    python3 tools/make-cover.py SOURCE src/assets/NAME-cover.webp [--top N]

Covers show at about 520x292 CSS px on desktop, so 1040x585 is 2x.
By default the 16:9 crop is centred vertically; --top N starts it N source
pixels from the top instead (for art whose subject sits near an edge).
Needs Pillow (pip install pillow).
"""
import argparse
import os

from PIL import Image

WIDTH, HEIGHT = 1040, 585

parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument("source")
parser.add_argument("output")
parser.add_argument("--top", type=int, help="crop offset from the top, in source pixels")
parser.add_argument("--quality", type=int, default=85)
args = parser.parse_args()

image = Image.open(args.source).convert("RGB")
w, h = image.size
if w / h > 16 / 9:  # wider than 16:9: trim the sides evenly
    cw = round(h * 16 / 9)
    left = (w - cw) // 2
    box = (left, 0, left + cw, h)
else:  # taller: trim top and bottom
    ch = round(w * 9 / 16)
    top = (h - ch) // 2 if args.top is None else max(0, min(args.top, h - ch))
    box = (0, top, w, top + ch)
image.crop(box).resize((WIDTH, HEIGHT), Image.LANCZOS).save(args.output, "WEBP", quality=args.quality, method=6)
print(f"{args.output}: {WIDTH}x{HEIGHT}, {os.path.getsize(args.output) // 1024} KB (crop {box} of {w}x{h})")
