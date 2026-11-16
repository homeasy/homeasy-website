"use client";

import Image from "next/image";
import { useId, useState } from "react";

/**
 * Before / after photo comparison (PRD §8.1 S6): drag the handle, or use the arrow keys, to reveal more of either photo.
 * Both photos must be the same size. Use only real, consented installation photos (PRD §5.5).
 */
export function BeforeAfterSlider({
  before,
  after,
  width,
  height,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  width: number;
  height: number;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [split, setSplit] = useState(50);
  const id = useId();
  return (
    <figure className="min-w-0">
      <div className="relative overflow-hidden rounded-card border border-line" style={{ aspectRatio: `${width} / ${height}` }}>
        <Image src={after.src} alt={after.alt} width={width} height={height} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} width={width} height={height} className="size-full object-cover" />
        </div>
        <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-[13px] font-semibold text-white">
          {beforeLabel}
        </span>
        <span aria-hidden="true" className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-ink">
          {afterLabel}
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${split}%` }} />
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label={`Show more of the ${beforeLabel.toLowerCase()} or the ${afterLabel.toLowerCase()} photo`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0 focus-visible:opacity-100"
        />
      </div>
    </figure>
  );
}
