"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Camera, ChevronDown, Menu, X } from "lucide-react";
import nav from "@/data/navigation.json";

/**
 * Mobile navigation drawer. Uses the native <dialog> (showModal) so focus trapping,
 * ESC to close, background inertness and focus restore come from the browser.
 * The drawer closes on every link click because Next keeps routes mounted (Activity).
 */
/** `social` is the server-rendered social links row (it reads the published contact details). */
export function MobileDrawer({ photoHref, social }: { photoHref: string; social: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        aria-haspopup="dialog"
        className="inline-flex size-11 items-center justify-center rounded-button text-ink hover:bg-cloud lg:hidden"
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        onClick={(e) => {
          // click on the backdrop (outside the panel) closes the drawer
          if (e.target === dialogRef.current) close();
        }}
        className="m-0 ml-auto h-dvh max-h-dvh w-[min(100vw,360px)] max-w-none bg-white p-0 text-ink backdrop:bg-navy/50"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            <Image src="/logo/homeasy-logo-light.svg" alt="Homeasy" width={146} height={32} className="h-8 w-auto" />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-button hover:bg-cloud"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-2">
            <ul>
              {nav.header.map((item) =>
                item.children ? (
                  <li key={item.href}>
                    <button
                      type="button"
                      aria-expanded={solutionsOpen}
                      onClick={() => setSolutionsOpen((v) => !v)}
                      className="flex min-h-12 w-full items-center justify-between rounded-sm px-3 text-left text-[17px] font-semibold hover:bg-cloud"
                    >
                      {item.label}
                      <ChevronDown
                        size={20}
                        aria-hidden="true"
                        className={`transition-transform ${solutionsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <ul hidden={!solutionsOpen} className="pb-1 pl-3">
                      {nav.solutions.map((s) => (
                        <li key={s.href}>
                          <DrawerLink href={s.href} onNavigate={close} small>
                            {s.label}
                          </DrawerLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.href}>
                    <DrawerLink href={item.href} onNavigate={close}>
                      {item.label === "App" ? "Homeasy app" : item.label}
                    </DrawerLink>
                  </li>
                ),
              )}
            </ul>
            <ul className="mt-2 border-t border-line pt-2">
              {nav.drawerExtra.map((item) => (
                <li key={item.href}>
                  <DrawerLink href={item.href} onNavigate={close} small>
                    {item.label}
                  </DrawerLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 border-t border-line p-4">
            <Link href="/book-survey" onClick={close} className="btn btn-primary w-full">
              Book a free home survey
            </Link>
            <a href={photoHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
              <Camera size={18} aria-hidden="true" />
              Send a switchboard photo
            </a>
            {social}
          </div>
        </div>
      </dialog>
    </>
  );
}

function DrawerLink({
  href,
  children,
  onNavigate,
  small = false,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex min-h-12 items-center rounded-sm px-3 text-ink no-underline hover:bg-cloud ${
        small ? "text-base font-normal" : "text-[17px] font-semibold"
      }`}
    >
      {children}
    </Link>
  );
}
