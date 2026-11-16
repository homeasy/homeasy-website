/** Keyword matching used by the SEO checks. Plain functions with no server code, so the article editor can score text while it is typed. */
// "near me" is answered by the place names on the page, and "vs"/"how" carry no meaning of their own
const STOP = new Set(["a", "an", "the", "in", "on", "for", "of", "to", "and", "or", "with", "your", "my", "is", "at", "by", "near", "me", "vs", "how"]);
const stem = (w: string) => (w.length > 3 ? w.replace(/ies$/, "y").replace(/(ch|sh|s|x|z)es$/, "$1").replace(/s$/, "") : w);
/** One spelling for words people write two ways: Wi-Fi / wifi, switchboard / switch board, switchbox / switch box. */
const spell = (t: string) => t.toLowerCase().replace(/wi[-\s]fi/g, "wifi").replace(/switch(board|box)/g, "switch $1");
export const keywordWords = (k: string) => spell(k).split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w)).map(stem);
/** Share of the keyword's words found in the text (0–1). */
export function keywordMatch(keyword: string, text: string): number {
  const words = keywordWords(keyword);
  if (!words.length) return 0;
  const hay = new Set(spell(text).split(/[^a-z0-9]+/).map(stem));
  return words.filter((w) => hay.has(w)).length / words.length;
}
/** How many times the whole phrase appears. */
export const phraseCount = (keyword: string, text: string) => {
  const k = keyword.toLowerCase().trim();
  return k ? text.split(k).length - 1 : 0;
};
