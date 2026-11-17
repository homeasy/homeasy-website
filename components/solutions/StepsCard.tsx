import type { ReactNode } from "react";

/**
 * "How it works" in three short steps, as a card for the right-hand side of a hero (PageHero `aside`).
 * Used by the partner programme and the four solution pages so they all open the same way: what to do first,
 * what we do next, what you get.
 */
export function StepsCard({ title = "How it works", steps, children }: { title?: string; steps: { title: string; body: string }[]; children?: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[460px] rounded-section border border-line bg-white p-6 lg:p-7">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{title}</h2>
      <ol className="mt-4 space-y-5">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-amber text-[15px] font-bold text-navy">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[1.0625rem] font-semibold leading-snug text-ink">{s.title}</span>
              <span className="mt-1 block text-[15px] text-body">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
      {children && <div className="mt-6 border-t border-line pt-5">{children}</div>}
    </div>
  );
}
