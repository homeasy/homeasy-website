"""
Builds the two small data files behind the admin's "Leads across Bihar" map:
  data/bihar-districts.json  district outlines as SVG paths (from geoBoundaries, ODbL 1.0)
  data/bihar-pincodes.json   pincode -> district (from the India Post "All India Pincode Directory", data.gov.in)

Usage (downloads are NOT kept in the repo):
  python3 -I scripts/geo/build-bihar-map.py <folder with adm1.geojson, adm2.geojson, pins.csv>
Sources:
  adm1 / adm2: https://www.geoboundaries.org (gbOpen, IND, ADM1 and ADM2, simplified GeoJSON)
  pins.csv:    All India Pincode Directory (data.gov.in), any CSV copy with pincode, Districtname, statename columns
"""
import csv, json, math, re, sys, unicodedata
from collections import Counter, defaultdict

src = sys.argv[1]
W = 640.0  # width of the drawing in SVG units

def rings(geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    return [p[0] for p in polys]  # outer rings only

def inside(pt, ring):
    x, y = pt; hit = False
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            hit = not hit
    return hit

def area_centroid(ring):
    a = cx = cy = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        f = x1 * y2 - x2 * y1; a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f
    a /= 2
    return abs(a), ((cx / (6 * a), cy / (6 * a)) if a else ring[0])

def simplify(pts, tol):  # Douglas-Peucker
    if len(pts) < 3: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True; stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop(); (x1, y1), (x2, y2) = pts[a], pts[b]; dx, dy = x2 - x1, y2 - y1; n = math.hypot(dx, dy) or 1e-12
        best, at = 0.0, -1
        for i in range(a + 1, b):
            d = abs(dy * (pts[i][0] - x1) - dx * (pts[i][1] - y1)) / n
            if d > best: best, at = d, i
        if best > tol: keep[at] = True; stack += [(a, at), (at, b)]
    return [p for p, k in zip(pts, keep) if k]

adm1 = json.load(open(f"{src}/adm1.geojson"))
NAMES = {"Pashchim Champaran": "West Champaran", "Purba Champaran": "East Champaran", "Kaimur (Bhabua)": "Kaimur"}
plain = lambda s: unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().strip()  # "Bihār" -> "Bihar"
bihar = next(f for f in adm1["features"] if plain(f["properties"]["shapeName"]).lower() == "bihar")
bihar_rings = rings(bihar["geometry"])

districts = []
for f in json.load(open(f"{src}/adm2.geojson"))["features"]:
    rs = rings(f["geometry"])
    big = max(rs, key=lambda r: area_centroid(r)[0])
    c = area_centroid(big)[1]
    if any(inside(c, r) for r in bihar_rings):
        districts.append((plain(f["properties"]["shapeName"]), rs, c))
districts.sort(key=lambda d: d[0])
print(len(districts), "districts:", ", ".join(d[0] for d in districts), file=sys.stderr)

xs = [x for _, rs, _ in districts for r in rs for x, _ in r]; ys = [y for _, rs, _ in districts for r in rs for _, y in r]
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
k = math.cos(math.radians((miny + maxy) / 2))  # one degree of longitude is shorter than one of latitude here
scale = W / ((maxx - minx) * k); H = (maxy - miny) * scale
proj = lambda p: ((p[0] - minx) * k * scale, (maxy - p[1]) * scale)
num = lambda v: re.sub(r"\.0$", "", f"{v:.1f}")

key = lambda s: re.sub(r"[^a-z]", "", s.lower())
ALIAS = {"purbichamparan": "eastchamparan", "pashchimchamparan": "westchamparan", "purbachamparan": "eastchamparan", "kaimur": "kaimur", "kaimurbhabua": "kaimur", "aurangabadbh": "aurangabad", "purnea": "purnia", "monghyr": "munger", "jehanabad": "jehanabad", "saran": "saran", "eastchamparan": "eastchamparan", "westchamparan": "westchamparan"}
norm = lambda s: ALIAS.get(key(s), key(s))

out = []
for i, (name, rs, c) in enumerate(districts):
    d = ""
    for r in rs:
        ring = [proj(p) for p in r]
        # a closed ring starts and ends at the same point: split it at the point farthest from the start, simplify both halves
        far = max(range(len(ring)), key=lambda i: math.hypot(ring[i][0] - ring[0][0], ring[i][1] - ring[0][1]))
        pts = simplify(ring[: far + 1], 0.45)[:-1] + simplify(ring[far:], 0.45)
        if len(pts) >= 4: d += "M" + "L".join(f"{num(x)},{num(y)}" for x, y in pts[:-1]) + "Z"
    cx, cy = proj(c)
    out.append({"id": i, "name": NAMES.get(name, name), "d": d, "cx": round(cx, 1), "cy": round(cy, 1)})
ids = {norm(d["name"]): d["id"] for d in out}

votes = defaultdict(Counter); unknown = Counter()
for row in csv.DictReader(open(f"{src}/pins.csv", encoding="latin-1")):
    if row["statename"].strip().upper() != "BIHAR": continue
    n = norm(row["Districtname"])
    if n in ids: votes[row["pincode"].strip()][ids[n]] += 1
    else: unknown[row["Districtname"]] += 1
pins = {p: c.most_common(1)[0][0] for p, c in sorted(votes.items())}
print(len(pins), "pincodes; unmatched district names:", dict(unknown), file=sys.stderr)
print("districts without any pincode:", [d["name"] for d in out if d["id"] not in set(pins.values())], file=sys.stderr)

json.dump({
    "_note": "Built by scripts/geo/build-bihar-map.py. District outlines: geoBoundaries (gbOpen IND ADM2, 2021; source Pathways Data Pvt. Ltd. / lgdirectory.gov.in), Open Database License 1.0. Simplified for a small on-screen map: not for measuring.",
    "credit": "District outlines: geoBoundaries (ODbL). Pincodes: India Post directory, data.gov.in.",
    "width": W, "height": round(H, 1), "districts": out,
}, open("data/bihar-districts.json", "w"), separators=(",", ":"))
json.dump({
    "_note": "Built by scripts/geo/build-bihar-map.py from the India Post All India Pincode Directory (data.gov.in). pincode -> district id in bihar-districts.json. The directory is some years old: a new pincode may be missing, and then the lead is counted under 'pincode not on the map'.",
    "pins": pins,
}, open("data/bihar-pincodes.json", "w"), separators=(",", ":"))
