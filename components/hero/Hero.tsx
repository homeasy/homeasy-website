"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Camera, Eye, Move3d, Zap } from "lucide-react";
import { AppPanel } from "./AppPanel";
import { ALL_OFF, type DeviceId, type Devices } from "./devices";
import type { PhotoScene } from "./photo-scene";

type Props = {
  tagline: string;
  photoHref: string;
};

const DESKTOP = "(min-width: 1024px)";

/**
 * Homepage hero: "Same switch. Smarter home." (founder decisions 16 Nov 2026).
 * A photoreal living room rendered in Blender/Cycles (scripts/blender), relit live in the browser per device,
 * with depth parallax for the 3D feel (mouse on desktop, tilt on phones). Same experience on every device:
 * desktop = full-bleed behind the text; phones = the room under the text with the app card below.
 * Before WebGL is ready (or if it is unavailable) the real dusk render shows as a still photo.
 */
export function Hero({ tagline, photoHref }: Props) {
  const [devices, setDevices] = useState<Devices>(ALL_OFF);
  const [inside, setInside] = useState(false);
  const [live, setLive] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<PhotoScene | null>(null);

  const toggle = (id: DeviceId) => setDevices((d) => ({ ...d, [id]: !d[id] }));

  useEffect(() => {
    let cancelled = false;
    let idle = 0;
    const desktop = window.matchMedia(DESKTOP).matches;
    queueMicrotask(() => !cancelled && setIsDesktop(desktop));

    const start = async () => {
      if (cancelled || !canvasRef.current || !labelRef.current) return;
      try {
        const { createPhotoScene } = await import("./photo-scene");
        if (cancelled || !canvasRef.current || !labelRef.current) return;
        const scene = await createPhotoScene({
          canvas: canvasRef.current,
          label: labelRef.current,
          base: desktop ? "/hero/desktop/" : "/hero/mobile/",
          anchorX: desktop ? 1 : 0.5,
          onToggle: (id) => setDevices((d) => ({ ...d, [id]: !d[id] })),
        });
        if (cancelled) {
          scene.dispose();
          return;
        }
        sceneRef.current = scene;
        requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && setLive(true)));
      } catch {
        /* keep the still photo */
      }
    };
    const schedule = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 150));
      idle = ric(() => void start()) as number;
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => sceneRef.current?.setDevices(devices), [devices, live]);

  const onCount = Object.values(devices).filter(Boolean).length;
  const hint = inside
    ? "Plate off: the Homeasy module sits inside your existing switchbox, wired to the same switches. Illustrative render."
    : onCount === 0
      ? "Tap the switchboard, the lamp, the TV, the AC or the fan — or use the app."
      : "Same switches. Now on your phone too.";

  const controls = (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={devices.light}
        onClick={() => toggle("light")}
        className="btn min-h-11 bg-amber text-navy hover:bg-amber-300"
      >
        <Zap size={18} aria-hidden="true" />
        {devices.light ? "Switch off" : "Flip the switch"}
      </button>
      <button
        type="button"
        aria-pressed={inside}
        onClick={() => setInside((v) => !v)}
        className="btn min-h-11 border border-ink text-ink hover:bg-cloud lg:border-navy-700 lg:text-white lg:hover:bg-navy-700"
      >
        <Eye size={18} aria-hidden="true" />
        {inside ? "Back to the room" : "See inside the switch"}
      </button>
    </>
  );

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-white lg:h-[calc(100dvh-72px)] lg:max-h-[880px] lg:min-h-[680px] lg:bg-navy"
    >
      {/* left scrim keeps the headline readable over the room (desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-[60%] bg-[linear-gradient(90deg,rgba(11,18,32,0.95)_0%,rgba(11,18,32,0.86)_48%,rgba(11,18,32,0)_100%)] lg:block"
      />

      <div className="container-page grid gap-8 py-10 lg:h-full lg:grid-cols-[minmax(0,540px)_1fr] lg:items-center lg:py-0">
        {/* Text column (LCP) */}
        <div className="relative z-10 min-w-0 lg:on-dark">
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate lg:text-amber">{tagline}</p>
          <h1 id="hero-title" className="hero-title mt-4 text-[clamp(2.5rem,5.4vw,5.25rem)] leading-[1] text-ink lg:text-white">
            <span className="whitespace-nowrap">Same switch.</span>
            <br />
            <span
              className={`-ml-[0.12em] inline-block whitespace-nowrap rounded-[0.18em] px-[0.12em] transition-colors duration-500 ${
                devices.light ? "bg-amber text-navy" : "bg-transparent"
              }`}
            >
              Smarter home.
            </span>
          </h1>
          <p className="mt-5 text-h4 font-semibold leading-snug text-ink lg:text-white">
            Make your existing home smart — without changing your switches.
          </p>
          <p className="mt-3 text-body lg:text-mist">
            Homeasy fits small smart modules inside your existing switchbox, installed by our own team. No rewiring, no
            broken walls. Control lights, fans, TV and AC from your phone, and your switches still work.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/book-survey" className="btn btn-primary min-h-12 whitespace-nowrap px-6">
              Book a free home survey
            </Link>
            <a
              href={photoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn min-h-12 whitespace-nowrap border border-ink text-ink hover:bg-cloud lg:border-navy-700 lg:text-white lg:hover:bg-navy-700"
            >
              <Camera size={18} aria-hidden="true" />
              Send a switchboard photo
            </a>
          </div>
          <p className="mt-4 text-sm text-slate lg:text-mist">
            Free survey · Installed by trained electricians ·{" "}
            <a href="#service-area" className="underline underline-offset-2 hover:no-underline">
              Now serving Bihar
            </a>
          </p>
          <div className="mt-8 hidden flex-wrap items-center gap-3 lg:flex">
            {controls}
            <p aria-live="polite" className="basis-full text-sm text-mist">
              {hint}
            </p>
          </div>
        </div>

        {/* The room: a card on phones; the full-bleed background on desktop */}
        <div className="min-w-0">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-section bg-navy lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none"
            onPointerDown={() => sceneRef.current?.enableTilt()}
          >
            {/* still photo: shows instantly and stays if WebGL is unavailable */}
            <picture>
              <source media={DESKTOP} srcSet="/hero/desktop/ambient.jpg" />
              <img
                src="/hero/mobile/ambient.jpg"
                alt="A living room at dusk with a sofa, table lamp, TV, AC, ceiling fan and a modular switchboard"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 lg:object-right ${
                  live ? "opacity-0" : "opacity-100"
                }`}
              />
            </picture>
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className={`absolute inset-0 block h-full w-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
            />

            {/* "see inside the switch": rendered close-ups, plate on → plate off */}
            <div
              aria-hidden={!inside}
              className={`absolute inset-0 z-[4] transition-opacity duration-700 ${inside ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <Image src="/hero/switch/closed.jpg" alt="" fill sizes="100vw" className="object-cover object-[82%_50%] lg:object-center" />
              <Image
                src="/hero/switch/open.jpg"
                alt="Inside the switchbox: a compact Homeasy module wired behind the existing switches (illustrative render)"
                fill
                sizes="100vw"
                className={`object-cover object-[82%_50%] lg:object-center transition-opacity delay-500 duration-1000 ${inside ? "opacity-100" : "opacity-0"}`}
              />
              <span className="absolute bottom-3 right-3 rounded-full lg:bottom-24 lg:right-6 bg-navy/80 px-2.5 py-1 text-[11px] font-semibold text-white">
                Illustrative render
              </span>
            </div>

            {/* hover label, positioned by the viewer */}
            <div
              ref={labelRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-20 rounded-full bg-navy px-3 py-1.5 text-[13px] font-semibold text-white opacity-0 transition-opacity"
            />

            {live && !inside && (
              <p className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-ink lg:right-6 lg:top-6">
                <Move3d size={14} aria-hidden="true" />
                {isDesktop ? "Move your mouse · click anything" : "Tilt your phone · tap anything"}
              </p>
            )}

            {inside && (
              <ol className="absolute bottom-10 left-3 right-3 z-10 space-y-1.5 rounded-card bg-navy/90 p-4 pl-9 text-sm leading-snug text-white lg:bottom-auto lg:left-auto lg:right-8 lg:top-8 lg:w-80">
                <li className="list-decimal">The plate comes off your existing switchboard.</li>
                <li className="list-decimal">A Homeasy module fits inside the same box, wired to your switches.</li>
                <li className="list-decimal">The plate goes back — same look, same switches.</li>
              </ol>
            )}

            {!inside && (
              <AppPanel
                devices={devices}
                onToggle={toggle}
                onScene={setDevices}
                variant="bar"
                className="absolute bottom-24 right-6 z-10 hidden w-[440px] lg:block xl:right-[max(24px,calc((100vw-1200px)/2))] xl:w-[540px]"
              />
            )}
          </div>

          {/* phones/tablets: app card + controls under the room */}
          <AppPanel devices={devices} onToggle={toggle} onScene={setDevices} className="mt-3 lg:hidden" />
          <div className="mt-4 flex flex-wrap items-center gap-3 lg:hidden">
            {controls}
            <p aria-live="polite" className="basis-full text-sm text-slate">
              {hint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
