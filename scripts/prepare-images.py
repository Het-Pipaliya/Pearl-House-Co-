#!/usr/bin/env python3
"""Turns the supplied 140-photo library into clean 1200x900 (4:3) images + writes scripts/catalog.json.

Usage: python3 scripts/prepare-images.py <folder containing public/images from the zip>

What it fixes (found by inspecting the originals):
  - ring/engagement/wedding photos sit inside ivory bars  -> crop to the real photo
  - necklaces have a few px of edge artefacts             -> trim the border
  - earrings/bracelets are wide strips on ivory; #11-20 have a caption baked in -> crop the caption off
  - 'pendants/' is a copy of 'necklaces/' (same pictures)  -> not used; necklaces are split into
    Necklaces and Pendants instead
Every source photo is used at most once (7 are used as category tiles instead of products).
"""
import json, os, shutil, sys
import numpy as np
from PIL import Image, ImageFilter

SRC = os.path.join(sys.argv[1], "public", "images")
OUT = "public/images/catalog"
SW, SH = 1200, 900

# (source, display name, category). Names written from the pictures themselves; the supplied index names did not match them.
R, E, W, N, EA, B = ("rings/ring", "engagement-rings/engagement-ring", "wedding-bands/wedding-band", "necklaces/necklace", "earrings/earring", "bracelets/bracelet")
ENG, RNG, WED, NCK, PND, EAR, BRC = "Engagement Rings", "Rings", "Wedding Bands", "Necklaces", "Pendants", "Earrings", "Bracelets"
ITEMS = [
  (R,1,"Six-Prong Solitaire",ENG),(R,2,"Cushion Halo Ring",ENG),(R,3,"Oval Three-Stone Ring",ENG),(R,6,"Solitaire Bridal Set",ENG),(R,7,"Emerald-Cut Solitaire",ENG),
  (R,10,"Rosé Pear Halo Ring",ENG),(R,13,"Round Halo Ring",ENG),(R,19,"Trilogy Brilliant Ring",ENG),(R,20,"Petite Solitaire Ring",ENG),
  (E,2,"Pavé Cushion Halo Ring",ENG),(E,3,"Cathedral Solitaire",ENG),(E,4,"Three-Stone Round Ring",ENG),(E,6,"Dainty Solitaire Ring",ENG),(E,7,"Solitaire Stacked Set",ENG),
  (E,13,"Pear Halo Ring",ENG),(E,14,"Pavé Cathedral Solitaire",ENG),(E,17,"Vintage Halo Ring",ENG),
  (R,5,"Infinity Twist Ring",RNG),(R,11,"Floral Cluster Ring",RNG),(R,17,"Open Bypass Ring",RNG),(R,18,"Heart Solitaire Ring",RNG),(E,9,"Infinity Pavé Ring",RNG),(E,10,"Sapphire Halo Ring",RNG),
  (R,4,"Gold Oval Eternity Band",WED),(R,8,"Marquise Eternity Band",WED),(R,9,"Brushed Gold Band",WED),(R,12,"Baguette Channel Band",WED),(R,14,"Milgrain Filigree Band",WED),(R,15,"Classic Gold Band",WED),(R,16,"Oval Stone Eternity Ring",WED),
  (E,5,"Round Eternity Band",WED),(E,8,"Baguette Pavé Band",WED),(E,11,"Marble Eternity Band",WED),(E,15,"Twisted Stack Band",WED),(E,16,"Brushed Platinum Band",WED),(E,18,"Curved Contour Band",WED),(E,19,"Chevron Pavé Band",WED),(E,20,"Slim Pavé Band",WED),
  (W,1,"Gold Eternity Band",WED),(W,2,"Twist Pavé Band",WED),(W,3,"Platinum Eternity Band",WED),(W,4,"Baguette Half-Eternity Band",WED),(W,5,"Satin Gold Band",WED),(W,6,"Wave Pavé Band",WED),(W,7,"Vintage Milgrain Band",WED),(W,8,"Triple Row Pavé Band",WED),
  (W,10,"Hammered Gold Band",WED),(W,11,"Wide Pavé Band",WED),(W,12,"Two-Tone Brushed Band",WED),(W,13,"Bezel Eternity Band",WED),(W,14,"Crossover Pavé Band",WED),(W,15,"Baguette Eternity Band",WED),(W,16,"Filigree Gold Band",WED),
  (W,17,"Princess Channel Band",WED),(W,18,"Tri-Colour Stack",WED),(W,19,"Petite Pavé Band",WED),(W,20,"Diamond Profile Band",WED),
  (N,8,"Diamond Tennis Necklace",NCK),(N,9,"Layered Chain Necklace",NCK),(N,12,"Floral Diamond Necklace",NCK),(N,13,"Ribbed Gold Collar",NCK),(N,14,"Diamond Station Necklace",NCK),(N,16,"Diamond Lariat Necklace",NCK),(N,17,"Marquise Leaf Necklace",NCK),
  (N,3,"Round Solitaire Pendant",PND),(N,4,"Pear Diamond Pendant",PND),(N,5,"Emerald Halo Pendant",PND),(N,6,"Ruby Halo Pendant",PND),(N,7,"Sapphire Halo Pendant",PND),(N,10,"Rosé Heart Pendant",PND),
  (N,11,"Art Deco Pendant",PND),(N,15,"Bezel Solitaire Pendant",PND),(N,18,"Emerald-Cut Pendant",PND),(N,19,"Round Halo Pendant",PND),(N,20,"Pearl Blossom Pendant",PND),
  (EA,1,"Classic Diamond Studs",EAR),(EA,2,"Halo Diamond Studs",EAR),(EA,3,"Classic Pearl Studs",EAR),(EA,4,"Floral Diamond Studs",EAR),(EA,5,"Princess-Cut Studs",EAR),(EA,6,"Pavé Huggie Hoops",EAR),
  (EA,7,"Gold Huggie Hoops",EAR),(EA,8,"Twisted Gold Hoops",EAR),(EA,9,"Inside-Out Diamond Hoops",EAR),(EA,10,"Pearl Drop Earrings",EAR),(EA,12,"Emerald-Cut Drops",EAR),(EA,13,"Floral Drop Earrings",EAR),
  (EA,14,"Cushion Halo Drops",EAR),(EA,15,"Triple Diamond Drops",EAR),(EA,16,"Chandelier Diamond Earrings",EAR),(EA,17,"Pearl Chandelier Earrings",EAR),(EA,18,"Art Deco Statement Earrings",EAR),
  (EA,19,"Infinity Statement Earrings",EAR),(EA,20,"Blossom Statement Earrings",EAR),
  (B,1,"Classic Diamond Tennis Bracelet",BRC),(B,3,"Baguette Tennis Bracelet",BRC),(B,4,"Floral Diamond Bracelet",BRC),(B,5,"Sapphire Tennis Bracelet",BRC),(B,6,"Ruby Tennis Bracelet",BRC),(B,7,"Emerald Tennis Bracelet",BRC),
  (B,8,"Multi-Gemstone Bracelet",BRC),(B,9,"Classic Pearl Bracelet",BRC),(B,10,"Double-Strand Pearl Bracelet",BRC),(B,11,"Gold Diamond Bangle",BRC),(B,12,"Pavé Diamond Bangle",BRC),(B,13,"Twist Diamond Bangle",BRC),
  (B,14,"Open Cuff Bracelet",BRC),(B,15,"Blossom Diamond Bracelet",BRC),(B,16,"Clover Charm Bracelet",BRC),(B,17,"Paperclip Chain Bracelet",BRC),(B,18,"Rope Chain Bracelet",BRC),(B,19,"Bezel Diamond Bracelet",BRC),(B,20,"Heart Charm Bracelet",BRC),
]
# Category tiles: photos taken OUT of the product list so no picture appears twice.
TILES = {"engagement-rings": (E,1), "rings": (E,12), "wedding-bands": (W,9), "necklaces": (N,1), "pendants": (N,2), "earrings": (EA,11), "bracelets": (B,2)}

BAND_TOP = 406
def band_bottom(prefix, n):  # strip photos: where the real picture ends (above any baked-in caption)
    if prefix == EA: return 1185 if n >= 16 else 1140 if n >= 11 else 1208
    if prefix == B:  return 1090 if n >= 16 else 1125 if n >= 11 else 1208
    return 1208

def load(prefix, n): return Image.open(f"{SRC}/{prefix}{n:02d}.webp").convert("RGB")

def trim_bottom(im, default=1418):
    """Ring-family photos sometimes have a sliver of the neighbouring collage tile near the bottom: find a hard edge and stop above it."""
    g = np.asarray(im.convert("L"), dtype=float).mean(axis=1)
    d = np.abs(np.diff(g)); j = max(range(1330, 1450), key=lambda i: d[i])
    return min((j - 8) if d[j] > 22 else default, default)

def crop43(im, box, ybias=0.5, xbias=0.5):
    """Largest 4:3 window inside `box`, then resize to 1200x900 (no padding, no stretching)."""
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    if w / h > 4 / 3:  nw, nh = int(h * 4 / 3), h          # too wide -> trim sides
    else:              nw, nh = w, int(w * 3 / 4)          # too tall -> trim top/bottom
    l = x0 + int((w - nw) * xbias); t = y0 + int((h - nh) * ybias)
    return im.crop((l, t, l + nw, t + nh)).resize((SW, SH), Image.LANCZOS)

# per-photo vertical focus for the few pictures where the subject is not centred (0 = top, 1 = bottom)
YBIAS = {(N, 16): 0.9, (N, 13): 0.5}

def process(prefix, n):
    im = load(prefix, n)
    if prefix in (R, E, W):                        # real photo sits between the ivory bars: rows ~150..bottom
        return crop43(im, (0, 150, im.width, trim_bottom(im)))
    if prefix == N:                                # square, trim edge artefacts
        return crop43(im, (24, 24, im.width - 24, im.height - 24), ybias=YBIAS.get((N, n), 0.5))
    bottom = band_bottom(prefix, n)                # earrings / bracelets: strip photo, caption cropped off
    return crop43(im, (0, BAND_TOP, im.width, bottom))

def slug(s): return "".join(c if c.isalnum() else "-" for c in s.lower().replace("é", "e")).strip("-").replace("--", "-")

shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
catalog, seen = [], set()
for prefix, n, name, cat in ITEMS:
    key = (prefix, n)
    assert key not in seen, key; seen.add(key)
    fn = f"{slug(name)}.webp"; assert not os.path.exists(f"{OUT}/{fn}"), "duplicate name " + name
    process(prefix, n).save(f"{OUT}/{fn}", "WEBP", quality=82, method=6)
    catalog.append({"name": name, "category": cat, "image": f"/images/catalog/{fn}", "source": f"{prefix}{n:02d}"})
tiles = {}
for cat, (prefix, n) in TILES.items():
    assert (prefix, n) not in seen, ("tile source also used as product", cat); seen.add((prefix, n))
    fn = f"tile-{cat}.webp"; process(prefix, n).save(f"{OUT}/{fn}", "WEBP", quality=84, method=6); tiles[cat] = f"/images/catalog/{fn}"
json.dump({"products": catalog, "tiles": tiles}, open("scripts/catalog.json", "w"), indent=1, ensure_ascii=False)
print(len(catalog), "products,", len(tiles), "tiles written;", len(seen), "source photos used once each")
