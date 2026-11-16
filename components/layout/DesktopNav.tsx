"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import nav from "@/data/navigation.json";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkBase =
  "relative inline-flex min-h-11 items-center whitespace-nowrap px-1 text-[15px] font-semibold text-ink no-underline transition-colors hover:text-blue-700";
const activeMark =
  "after:absolute after:inset-x-1 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-blue-700";

/**
 * The page address is only known per request on pages with a variable address (e.g. /products/[slug]),
 * so the part that reads it sits in <Suspense>; until it is known the menu shows with no item marked.
 */
export function DesktopNav({ earlyAccess = false }: { earlyAccess?: boolean }) {
  return (
    <Suspense fallback={<NavList pathname="" earlyAccess={earlyAccess} />}>
      <CurrentNav earlyAccess={earlyAccess} />
    </Suspense>
  );
}

function CurrentNav({ earlyAccess }: { earlyAccess: boolean }) {
  return <NavList pathname={usePathname()} earlyAccess={earlyAccess} />;
}

function NavList({ pathname, earlyAccess }: { pathname: string; earlyAccess: boolean }) {
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-3 xl:gap-6">
        {nav.header.map((item) =>
          item.children ? (
            <li key={item.href}>
              <SolutionsMenu active={isActive(pathname, item.href)} />
            </li>
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={`${linkBase} ${isActive(pathname, item.href) ? activeMark : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
        {/* a seventh item does not fit beside the buttons on the narrowest desktop widths */}
        {earlyAccess && (
          <li className="hidden min-[1100px]:block">
            <Link href="/early-access" aria-current={isActive(pathname, "/early-access") ? "page" : undefined} className={`${linkBase} ${isActive(pathname, "/early-access") ? activeMark : ""}`}>
              Early access
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

function SolutionsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`${linkBase} gap-1 ${active ? activeMark : ""}`}
      >
        Solutions
        <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id={menuId}
        hidden={!open}
        className="absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 rounded-card border border-line bg-white p-2"
      >
        <ul>
          {nav.solutions.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                onClick={() => setOpen(false)}
                className="block rounded-sm px-3 py-2.5 no-underline hover:bg-cloud"
              >
                <span className="block text-[15px] font-semibold text-ink">{s.label}</span>
                <span className="block text-sm text-slate">{s.description}</span>
              </Link>
            </li>
          ))}
          <li className="mt-1 border-t border-line pt-1">
            <Link
              href="/solutions"
              onClick={() => setOpen(false)}
              className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-link no-underline hover:bg-cloud"
            >
              All solutions →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
