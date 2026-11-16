import type { CSSProperties } from "react";

/**
 * Props for scroll-reveal: spread onto an element, e.g. <li {...reveal(i)}>.
 * `index` staggers siblings. The motion itself lives in app/globals.css and is switched on by
 * <RevealObserver /> (so content stays visible without JavaScript and under reduced motion).
 */
export function reveal(index = 0): { "data-reveal": ""; style: CSSProperties } {
  return { "data-reveal": "", style: { "--i": Math.min(index, 8) } as CSSProperties };
}
