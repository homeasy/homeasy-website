"use client";

import { useTransition } from "react";
import { FilePlus2 } from "lucide-react";
import { importStarterArticles } from "@/app/(admin)/admin/blog/actions";
import { useToast } from "./toast";

/** Adds the ready-written starter articles as drafts. Shown until all of them are in the list. */
export function StarterArticlesButton({ count }: { count: number }) {
  const toast = useToast();
  const [busy, start] = useTransition();
  return (
    <button
      type="button"
      disabled={busy}
      className="adm-btn adm-btn-secondary"
      onClick={() =>
        start(async () => {
          const r = await importStarterArticles();
          toast(r.ok ? "success" : "error", r.message);
        })
      }
    >
      <FilePlus2 size={16} aria-hidden="true" /> {busy ? "Adding…" : `Add the ${count} starter articles`}
    </button>
  );
}
