// Copies the official Chillax WOFF2 files from brand/fonts/chillax to public/fonts.
// Byte-for-byte copy with the original file names: the ITF Free Font License forbids
// subsetting, converting or renaming the font files (PRD §6.3).
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const src = join(process.cwd(), "brand", "fonts", "chillax");
const dest = join(process.cwd(), "public", "fonts");

if (!existsSync(src)) {
  if (existsSync(join(dest, "Chillax-Regular.woff2"))) process.exit(0);
  console.warn(
    "[fonts] brand/fonts/chillax not found. Download Chillax from fontshare.com and place the WOFF2 files there. Falling back to system fonts.",
  );
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
const files = readdirSync(src).filter((f) => f.endsWith(".woff2"));
for (const f of files) copyFileSync(join(src, f), join(dest, f));
console.log(`[fonts] copied ${files.length} Chillax file(s) to public/fonts`);
