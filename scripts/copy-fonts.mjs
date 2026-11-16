// Puts the official Chillax WOFF2 files in public/fonts, byte for byte and with their original names: the ITF
// Free Font License forbids subsetting, converting or renaming them, and they must not be in a public repo (PRD §6.3).
// Two sources, tried in order:
//   1. brand/fonts/chillax on this computer (git-ignored): copied as they are.
//   2. FONT_SOURCE_URL (used on Vercel, where the repo has no font files): the address of a folder you control that
//      holds the three files, e.g. a public Supabase Storage bucket. They are downloaded during the build and then
//      served from this site's own /fonts folder.
// With neither, the site builds and falls back to system fonts.
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FILES = ["Chillax-Regular.woff2", "Chillax-Semibold.woff2", "Chillax-Bold.woff2"];
const src = join(process.cwd(), "brand", "fonts", "chillax");
const dest = join(process.cwd(), "public", "fonts");
mkdirSync(dest, { recursive: true });

if (existsSync(src)) {
  const files = readdirSync(src).filter((f) => f.endsWith(".woff2"));
  for (const f of files) copyFileSync(join(src, f), join(dest, f));
  console.log(`[fonts] copied ${files.length} Chillax file(s) to public/fonts`);
} else if (process.env.FONT_SOURCE_URL) {
  const base = process.env.FONT_SOURCE_URL.replace(/\/$/, "");
  let ok = 0;
  for (const f of FILES) {
    try {
      const res = await fetch(`${base}/${f}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      // "wOF2" is the signature every WOFF2 file starts with: never save an error page as a font
      if (!res.ok || bytes.subarray(0, 4).toString("latin1") !== "wOF2") throw new Error(`status ${res.status}`);
      writeFileSync(join(dest, f), bytes);
      ok++;
    } catch (e) {
      console.warn(`[fonts] could not download ${f} from FONT_SOURCE_URL: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log(`[fonts] downloaded ${ok} of ${FILES.length} Chillax file(s) to public/fonts`);
} else if (!existsSync(join(dest, "Chillax-Regular.woff2"))) {
  console.warn("[fonts] No Chillax files found (brand/fonts/chillax or FONT_SOURCE_URL). Falling back to system fonts.");
}
