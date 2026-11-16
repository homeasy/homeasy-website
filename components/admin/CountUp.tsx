"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** A number that counts up to its value when the page opens. Shows the final value at once for reduced motion. */
export function CountUp({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  useBeforePaint(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || value === from.current) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let frame = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 800);
      setShown(start + (value - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(step);
      else from.current = value;
    };
    setShown(start);
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  const text = decimals ? shown.toFixed(decimals) : Math.round(shown).toLocaleString("en-IN");
  return (
    <>
      {prefix}
      {text}
      {suffix}
    </>
  );
}
