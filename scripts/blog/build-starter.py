"""Joins the starter articles (starter-1.py, starter-2.py) into data/blog-starter.json.
   Run: python3 -I scripts/blog/build-starter.py   (from the project folder)"""
import json, os, re, runpy
here = os.path.dirname(os.path.abspath(__file__))
ALT = {
 "convert-normal-switch-to-smart-switch": "Electrician fitting a small smart module behind an existing switchboard in an Indian home",
 "smart-switch-vs-normal-switch": "A hand pressing a normal wall switch beside a phone showing the same light in an app",
 "smart-home-without-internet": "Family member switching on a light by hand while the Wi-Fi router shows no connection",
 "home-automation-cost-in-india": "Written home automation quote on a table with a notebook and a room-by-room list",
 "wifi-smart-switch-for-home": "Wi-Fi router on a shelf with a wall switchboard in the same Indian living room",
 "smart-fan-regulator-control-fan-speed-from-phone": "Ceiling fan in a bedroom with a phone showing fan speed control",
 "geyser-smart-switch": "Bathroom geyser with its wall switch and a phone showing a morning schedule",
 "control-ac-from-phone": "Split AC on a bedroom wall with a phone showing temperature control",
 "home-automation-in-patna": "Apartment buildings and family homes in Patna in soft evening light",
 "home-automation-for-beginners": "Family in an Indian living room looking at a phone that controls the room lights",
}
out = []
for f in ("starter-1.py", "starter-2.py"):
    for a in runpy.run_path(os.path.join(here, f))["ARTICLES"]:
        body = re.sub(r">\s+<", "><", a["body"].strip())
        out.append({**a, "body_html": body, "cover_alt": ALT[a["slug"]]})
        del out[-1]["body"]
json.dump({"_note": "Ten starter articles for the blog, added from Admin → Blog articles → 'Add the starter articles'. After that they are ordinary articles edited in the admin; this file is not read again. Built by scripts/blog/build-starter.py. Every claim follows the honesty rules: no prices, certifications, savings figures or voice-assistant support.", "articles": out},
          open(os.path.join(here, "..", "..", "data", "blog-starter.json"), "w"), indent=1, ensure_ascii=False)
print(len(out), "articles")
