"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";

type Toast = { id: number; kind: "success" | "error"; text: string };
const Ctx = createContext<(kind: Toast["kind"], text: string) => void>(() => {});

/** Small messages in the corner after an action ("Lead updated."). */
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);
  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = next.current++;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <p
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-lg border bg-navy-800 px-4 py-3 text-sm text-white ${
              t.kind === "success" ? "border-emerald-400/40" : "border-red-400/50"
            }`}
          >
            {t.kind === "success" ? (
              <CircleCheck size={16} aria-hidden="true" className="shrink-0 text-emerald-300" />
            ) : (
              <TriangleAlert size={16} aria-hidden="true" className="shrink-0 text-red-300" />
            )}
            {t.text}
          </p>
        ))}
      </div>
    </Ctx.Provider>
  );
}
