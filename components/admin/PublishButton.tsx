"use client";

import { useTransition } from "react";
import { Rocket } from "lucide-react";
import { publishNow } from "@/app/(admin)/admin/products/actions";
import { useToast } from "./toast";

/** Publish with visible feedback: "Publishing…" while it runs, then what happened (or why it failed). */
export function PublishButton() {
  const toast = useToast();
  const [busy, start] = useTransition();
  return (
    <button
      type="button"
      disabled={busy}
      className="adm-btn adm-btn-primary adm-btn-sm mt-2 w-full"
      onClick={() =>
        start(async () => {
          try {
            const r = await publishNow();
            toast(r.ok ? "success" : "error", r.message);
          } catch {
            toast("error", "Publishing did not finish. Check the internet connection and try again.");
          }
        })
      }
    >
      <Rocket size={14} aria-hidden="true" /> {busy ? "Publishing…" : "Publish changes"}
    </button>
  );
}
