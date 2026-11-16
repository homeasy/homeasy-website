/** Keyword list types (admin only; not published). No server imports. */
export const KEYWORD_KINDS = ["target", "trending"] as const;
export const KEYWORD_STATUSES = ["planned", "optimized", "ranking"] as const;
export type Keyword = {
  id: string;
  term: string;
  kind: (typeof KEYWORD_KINDS)[number];
  page: string; // path, or "" when not assigned
  status: (typeof KEYWORD_STATUSES)[number];
  position: number | null; // typed in by hand from Google Search Console
  created_at: string;
};
export type Coverage = "strong" | "partial" | "missing" | "unassigned";

export type SpeedRun = {
  path: string;
  strategy: "mobile" | "desktop";
  at: string;
  scores: { performance: number | null; accessibility: number | null; bestPractices: number | null; seo: number | null };
  metrics: { lcp: number | null; fcp: number | null; tbt: number | null; cls: number | null; si: number | null };
  field: { lcp: number | null; inp: number | null; cls: number | null } | null;
  opportunities: { title: string; savingMs: number }[];
  previousPerformance: number | null;
};
