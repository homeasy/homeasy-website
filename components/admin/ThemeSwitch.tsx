"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

const KEY = "homeasy-admin-theme";
type Theme = "light" | "dark" | "system";
const OPTIONS: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

function apply(theme: Theme) {
  const light = theme === "light" || (theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches);
  document.documentElement.dataset.admTheme = light ? "light" : "dark";
}

/** Light / dark / system for the admin. Remembered on this device; "System" follows the computer or phone setting. */
export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme | null>(null); // unknown until the saved choice is read

  useEffect(() => {
    let saved: Theme = "dark";
    try {
      const v = localStorage.getItem(KEY);
      if (v === "light" || v === "dark" || v === "system") saved = v;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the saved choice is only known in the browser
    setTheme(saved);
  }, []);

  useEffect(() => {
    if (!theme) return;
    apply(theme);
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => apply("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const choose = (t: Theme) => {
    setTheme(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  };

  return (
    <div role="radiogroup" aria-label="Theme" className="flex rounded-lg border border-navy-700 bg-navy-800/60 p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={theme === o.id}
          onClick={() => choose(o.id)}
          className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs transition-colors ${
            theme === o.id ? "bg-amber/15 font-medium text-amber" : "text-mist hover:text-white"
          }`}
        >
          <o.icon size={14} aria-hidden="true" /> {o.label}
        </button>
      ))}
    </div>
  );
}
