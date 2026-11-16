/**
 * Flat drawing of a switch plate for the SAMPLE Readiness Report. A diagram, never a photo:
 * real reports carry photos of the customer's own switchboxes (PRD §8.21, honesty rules §5.5).
 * Decorative: the text beside it carries the meaning.
 */
export function SwitchboxDiagram({ switches, hasRegulator }: { switches: number; hasRegulator: boolean }) {
  const count = Math.max(0, Math.min(switches, 8));
  const slots = count + (hasRegulator ? 1 : 0);

  // no switches = a remote-controlled point (IR): draw a small remote instead of a plate
  if (slots === 0) {
    return (
      <svg viewBox="0 0 120 72" className="h-auto w-full max-w-[180px]" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="118" height="70" rx="10" fill="var(--surface-blue)" stroke="var(--border-default)" strokeWidth="2" />
        <rect x="46" y="12" width="28" height="48" rx="6" fill="var(--brand-white)" stroke="var(--brand-navy)" strokeWidth="2" />
        <circle cx="60" cy="24" r="4" fill="var(--brand-amber)" stroke="var(--brand-navy)" strokeWidth="1.5" />
        <rect x="53" y="34" width="14" height="4" rx="2" fill="var(--brand-navy)" />
        <rect x="53" y="42" width="14" height="4" rx="2" fill="var(--brand-navy)" />
        <rect x="53" y="50" width="14" height="4" rx="2" fill="var(--brand-navy)" />
      </svg>
    );
  }

  const gap = 6;
  const slotW = 20;
  const width = slots * slotW + (slots + 1) * gap + 2;
  return (
    <svg
      viewBox={`0 0 ${width} 72`}
      className="h-auto w-full"
      style={{ maxWidth: `${Math.max(90, width * 1.4)}px` }}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="1" width={width - 2} height="70" rx="10" fill="var(--brand-white)" stroke="var(--brand-navy)" strokeWidth="2" />
      {Array.from({ length: count }, (_, i) => {
        const x = 1 + gap + i * (slotW + gap);
        return (
          <g key={i}>
            <rect x={x} y="16" width={slotW} height="40" rx="4" fill="var(--surface-secondary)" stroke="var(--brand-navy)" strokeWidth="1.5" />
            <rect x={x + 4} y={i % 2 === 0 ? 20 : 38} width={slotW - 8} height="14" rx="2" fill={i % 2 === 0 ? "var(--brand-amber)" : "var(--border-default)"} />
          </g>
        );
      })}
      {hasRegulator && (
        <g>
          <circle cx={1 + gap + count * (slotW + gap) + slotW / 2} cy="36" r="10" fill="var(--surface-blue)" stroke="var(--brand-navy)" strokeWidth="1.5" />
          <rect x={1 + gap + count * (slotW + gap) + slotW / 2 - 1} y="28" width="2" height="8" rx="1" fill="var(--brand-navy)" />
        </g>
      )}
    </svg>
  );
}
