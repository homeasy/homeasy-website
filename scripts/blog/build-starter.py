"""Joins the starter articles (starter-1.py, starter-2.py) into data/blog-starter.json.
   Run: python3 -I scripts/blog/build-starter.py   (from the project folder)"""
import json, os, re, runpy
here = os.path.dirname(os.path.abspath(__file__))
ALT = {
 "convert-normal-switch-to-smart-switch": "Hands fitting a small smart module behind an open switchboard in a living room",
 "smart-switch-vs-normal-switch": "A finger pressing a wall switch while a phone shows the same living room light switched on",
 "smart-home-without-internet": "A woman switching on a light at the wall switch, with the Wi-Fi router showing a red light",
 "home-automation-cost-in-india": "A couple reading a room-by-room quote at a table with a notebook and pen",
 "wifi-smart-switch-for-home": "A Wi-Fi router on a shelf above a wall switchboard in a living room",
 "smart-fan-regulator-control-fan-speed-from-phone": "A phone showing fan speed control, held up below a ceiling fan in a bedroom",
 "geyser-smart-switch": "A phone showing a morning geyser schedule, beside a bathroom geyser and its switch",
 "control-ac-from-phone": "A phone showing AC temperature control in a bedroom with a split AC and a small IR device",
 "home-automation-in-patna": "Apartment buildings and family houses on a city street at sunset",
 "home-automation-for-beginners": "A family of three on a sofa looking at a phone together under a ceiling light"
}
out = []
for f in ("starter-1.py", "starter-2.py"):
    for a in runpy.run_path(os.path.join(here, f))["ARTICLES"]:
        body = re.sub(r">\s+<", "><", a["body"].strip())
        out.append({**a, "body_html": body, "cover_url": f"/images/blog/{a['slug']}.webp", "cover_alt": ALT[a["slug"]]})
        del out[-1]["body"]
json.dump({"_note": "Ten starter articles for the blog, added from Admin → Blog articles → 'Add the starter articles'. After that they are ordinary articles edited in the admin; this file is not read again. Built by scripts/blog/build-starter.py. Every claim follows the honesty rules: no prices, certifications, savings figures or voice-assistant support.", "articles": out},
          open(os.path.join(here, "..", "..", "data", "blog-starter.json"), "w"), indent=1, ensure_ascii=False)
print(len(out), "articles")
