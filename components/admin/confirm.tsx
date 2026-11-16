"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

type Options = { title: string; message: string; confirmLabel?: string; danger?: boolean };

/** Asks "are you sure?" in a dialog. Usage: const [confirm, node] = useConfirm(); if (await confirm({...})) … ; render {node}. */
export function useConfirm(): [(o: Options) => Promise<boolean>, ReactNode] {
  const [opts, setOpts] = useState<Options | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const confirm = useCallback((o: Options) => {
    setOpts(o);
    requestAnimationFrame(() => dialog.current?.showModal());
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (value: boolean) => {
    dialog.current?.close();
    resolver.current?.(value);
    resolver.current = null;
  };

  const node = (
    <dialog
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        close(false);
      }}
      className="m-auto w-[min(420px,calc(100vw-2rem))] rounded-xl border border-navy-700 bg-navy-800 p-0 text-white backdrop:bg-black/70"
    >
      {opts && (
        <div className="p-5">
          <h2 className="text-base font-semibold text-white">{opts.title}</h2>
          <p className="mt-2 text-sm text-mist">{opts.message}</p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" className="adm-btn adm-btn-secondary" onClick={() => close(false)}>
              Cancel
            </button>
            <button type="button" className={`adm-btn ${opts.danger ? "adm-btn-danger" : "adm-btn-primary"}`} onClick={() => close(true)}>
              {opts.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
  return [confirm, node];
}
