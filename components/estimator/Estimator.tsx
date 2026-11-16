"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { track } from "@/lib/analytics";
import { applianceLabels, estimate, pointsLabel, roomsBucket } from "./estimate";
import type { EstimatorAppliance, EstimatorData, EstimatorProduct, RoomState } from "./types";

type Props = {
  data: EstimatorData;
  products: EstimatorProduct[];
  /** flags.SHOW_PRICES, read on the server. false = no rupee amounts anywhere. */
  showPrices: boolean;
  /** wa.me link from the published contact settings. */
  whatsappHref: string;
};

const chip =
  "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-white px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-cloud has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-navy has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus-ring)]";
const stepBtn =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-button border border-line bg-white text-ink transition-colors hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-40";

function StepHeading({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div>
      <h2 className="flex items-center gap-3 text-h4 leading-snug">
        <span
          aria-hidden="true"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-amber text-[15px] font-bold text-navy"
        >
          {n}
        </span>
        {title}
      </h2>
      {hint && <p className="mt-2 text-[15px] text-body">{hint}</p>}
    </div>
  );
}

export function Estimator({ data, products, showPrices, whatsappHref }: Props) {
  const { copy } = data;
  const [homeType, setHomeType] = useState("");
  const [rooms, setRooms] = useState<RoomState[]>([]);
  const nextUid = useRef(1);
  const started = useRef(false);

  const applianceById = useMemo(() => new Map(data.appliances.map((a) => [a.id, a])), [data.appliances]);
  const lines = useMemo(() => estimate(data, products, rooms), [data, products, rooms]);
  const labels = useMemo(() => applianceLabels(data, rooms), [data, rooms]);
  const bucket = roomsBucket(rooms.length);
  const hasList = lines.length > 0;

  function used(action: string, roomsCount: number) {
    if (!started.current) {
      started.current = true;
      track("estimator_start", { rooms_count: roomsCount });
    }
    if (action !== "start") track("estimator_use", { action, rooms_count: roomsCount });
  }

  function addRoom(typeId: string) {
    if (rooms.length >= data.maxRooms) return;
    const type = data.rooms.find((r) => r.id === typeId);
    if (!type) return;
    const room: RoomState = { uid: nextUid.current++, type: typeId, counts: { ...type.defaults } };
    // keep rooms of the same type together, in the order of the room list
    const order = (r: RoomState) => data.rooms.findIndex((t) => t.id === r.type);
    const next = [...rooms, room].sort((a, b) => order(a) - order(b) || a.uid - b.uid);
    setRooms(next);
    used(`add_${typeId}`, next.length);
  }

  function removeRoom(typeId: string) {
    const last = rooms.findLast((r) => r.type === typeId);
    if (!last) return;
    const next = rooms.filter((r) => r.uid !== last.uid);
    setRooms(next);
    used(`remove_${typeId}`, next.length);
  }

  function setCount(uid: number, appliance: EstimatorAppliance, value: number) {
    const n = Math.max(0, Math.min(appliance.max, Number.isFinite(value) ? Math.round(value) : 0));
    setRooms((prev) => prev.map((r) => (r.uid === uid ? { ...r, counts: { ...r.counts, [appliance.id]: n } } : r)));
    used("start", rooms.length);
  }

  function reset() {
    setRooms([]);
    setHomeType("");
    used("reset", 0);
  }

  /** "Bedroom 1", "Bedroom 2", or just "Kitchen" when there is only one. */
  function roomName(room: RoomState): string {
    const type = data.rooms.find((t) => t.id === room.type);
    const same = rooms.filter((r) => r.type === room.type);
    const label = type?.label ?? "Room";
    return same.length > 1 ? `${label} ${same.indexOf(room) + 1}` : label;
  }

  const roomSummary = data.rooms
    .map((t) => ({ label: t.label, n: rooms.filter((r) => r.type === t.id).length }))
    .filter((r) => r.n > 0)
    .map((r) => `${r.n} × ${r.label}`)
    .join(", ");

  const moduleSummary = lines
    .map((l) => (l.modules === null ? `${l.name} for ${pointsLabel(l)}` : `${l.modules} × ${l.name}`))
    .join(", ");

  // /book-survey pre-fill: values match ROOM_OPTIONS and APPLIANCES in lib/leads/schema.ts
  const surveyParams = new URLSearchParams();
  if (bucket) surveyParams.set("rooms", bucket);
  if (labels.length) surveyParams.set("appliances", labels.join(","));
  if (homeType) surveyParams.set("homeType", homeType);
  surveyParams.set("source", "estimator");
  const surveyHref = `/book-survey?${surveyParams.toString()}`;

  // same WhatsApp number as the rest of the site, with the list as the message
  const whatsappListHref = useMemo(() => {
    if (!hasList) return whatsappHref;
    const message = [
      "Hi Homeasy, here is my list from the estimator.",
      homeType ? `Home: ${homeType}.` : "",
      `Rooms: ${roomSummary}.`,
      `Indicative modules: ${moduleSummary}.`,
      "Please confirm at a free survey.",
    ]
      .filter(Boolean)
      .join(" ");
    return `${whatsappHref.split("?")[0]}?text=${encodeURIComponent(message)}`;
  }, [hasList, whatsappHref, homeType, roomSummary, moduleSummary]);

  function ctaParams() {
    return {
      rooms_count: rooms.length,
      appliances_count: labels.length,
      modules: lines.map((l) => l.slug).join(","),
    };
  }

  const liveText = hasList
    ? `${copy.resultTitle}: ${moduleSummary}. ${showPrices ? "" : copy.noPrice + "."}`
    : copy.resultEmpty;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
      <div className="min-w-0 space-y-10">
        {/* 1. Home type */}
        <fieldset className="min-w-0">
          <legend className="sr-only">{copy.homeTitle}</legend>
          <StepHeading n={1} title={copy.homeTitle} hint={copy.homeHint} />
          <div className="mt-4 flex flex-wrap gap-2">
            {data.homeTypes.map((t) => (
              <label key={t} className={chip}>
                <input
                  type="radio"
                  name="estimator-home-type"
                  value={t}
                  checked={homeType === t}
                  onChange={() => {
                    setHomeType(t);
                    used("home_type", rooms.length);
                  }}
                  className="sr-only"
                />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 2. Rooms */}
        <div className="min-w-0">
          <StepHeading n={2} title={copy.roomsTitle} hint={copy.roomsHint} />
          <ul className="mt-4 divide-y divide-line rounded-card border border-line bg-white">
            {data.rooms.map((t) => {
              const n = rooms.filter((r) => r.type === t.id).length;
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                  <span className="min-w-0 font-semibold text-ink">{t.label}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      className={stepBtn}
                      onClick={() => removeRoom(t.id)}
                      disabled={n === 0}
                      aria-label={`Remove one: ${t.label}`}
                    >
                      <Minus size={18} aria-hidden="true" />
                    </button>
                    <span className="w-7 text-center text-lg font-semibold tabular-nums text-ink">
                      <span className="sr-only">{t.label}: </span>
                      {n}
                    </span>
                    <button
                      type="button"
                      className={stepBtn}
                      onClick={() => addRoom(t.id)}
                      disabled={rooms.length >= data.maxRooms}
                      aria-label={`Add one: ${t.label}`}
                    >
                      <Plus size={18} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          {rooms.length >= data.maxRooms && (
            <p className="mt-3 text-[15px] text-body">
              That is the most rooms this estimator handles. For a bigger home, book the free survey and we will plan it
              with you.
            </p>
          )}
        </div>

        {/* 3. What to control */}
        <div className="min-w-0">
          <StepHeading n={3} title={copy.controlTitle} hint={rooms.length ? copy.controlHint : copy.controlEmpty} />
          <div className="mt-4 space-y-4">
            {rooms.map((room) => {
              const type = data.rooms.find((t) => t.id === room.type);
              const name = roomName(room);
              const items = (type?.appliances ?? []).flatMap((id) => applianceById.get(id) ?? []);
              const counts = items.filter((a) => a.kind === "count");
              const toggles = items.filter((a) => a.kind === "toggle");
              return (
                <fieldset key={room.uid} className="min-w-0 rounded-card border border-line bg-white p-4 sm:p-5">
                  <legend className="float-left mb-3 w-full text-[1.0625rem] font-semibold text-ink">{name}</legend>
                  <div className="clear-both space-y-3">
                    {counts.map((a) => {
                      const id = `est-${room.uid}-${a.id}`;
                      const value = room.counts[a.id] ?? 0;
                      return (
                        <div key={a.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                          <div className="min-w-0">
                            <label htmlFor={id} className="block text-[15px] font-semibold text-ink">
                              {a.question}
                            </label>
                            {a.hint && (
                              <p id={`${id}-hint`} className="text-sm text-slate">
                                {a.hint}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              className={stepBtn}
                              onClick={() => setCount(room.uid, a, value - 1)}
                              disabled={value <= 0}
                              aria-label={`Fewer: ${a.question}, ${name}`}
                            >
                              <Minus size={18} aria-hidden="true" />
                            </button>
                            <input
                              id={id}
                              type="number"
                              inputMode="numeric"
                              min={0}
                              max={a.max}
                              step={1}
                              value={value}
                              onChange={(e) => setCount(room.uid, a, e.target.valueAsNumber)}
                              aria-describedby={a.hint ? `${id}-hint` : undefined}
                              className="h-11 w-14 rounded-input border border-line bg-white px-1 text-center text-lg font-semibold tabular-nums text-ink [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              className={stepBtn}
                              onClick={() => setCount(room.uid, a, value + 1)}
                              disabled={value >= a.max}
                              aria-label={`More: ${a.question}, ${name}`}
                            >
                              <Plus size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {toggles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {toggles.map((a) => (
                          <label key={a.id} className={chip}>
                            <input
                              type="checkbox"
                              checked={(room.counts[a.id] ?? 0) > 0}
                              onChange={(e) => setCount(room.uid, a, e.target.checked ? 1 : 0)}
                              className="sr-only"
                            />
                            {a.question}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Result */}
      <aside aria-labelledby="estimator-result-title" className="min-w-0 lg:sticky lg:top-28">
        <div className="rounded-card border border-line bg-white p-5 sm:p-6">
          <h2 id="estimator-result-title" className="flex items-center gap-3 text-h4 leading-snug">
            <span
              aria-hidden="true"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-amber text-[15px] font-bold text-navy"
            >
              4
            </span>
            {copy.resultTitle}
          </h2>

          {/* Short spoken summary: the visible list below changes too often to announce in full */}
          <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {liveText}
          </p>

          {hasList ? (
            <>
              <p className="mt-3 text-[15px] text-body">{roomSummary}</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {lines.map((l) => (
                  <li key={l.slug} className="flex items-start gap-3 py-4">
                    <span className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-sm bg-tint px-2 text-[15px] font-bold tabular-nums text-ink">
                      {l.modules === null ? "•" : `${l.modules}×`}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">
                        {l.name}
                        {l.status !== "available" && <span className="font-normal text-body"> (Planned)</span>}
                      </span>
                      <span className="block text-[15px] text-body">
                        For {pointsLabel(l)}
                        {l.modules === null && `. ${copy.relayPending}.`}
                      </span>
                      {showPrices && (
                        <span className="mt-1 block text-[15px] font-semibold text-ink">
                          {typeof l.price === "number" ? `From ₹${l.price.toLocaleString("en-IN")} each` : copy.noPrice}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {!showPrices && <p className="mt-4 text-[1.1875rem] font-semibold text-ink">{copy.noPrice}</p>}
              <p className="mt-2 text-[15px] text-body">{showPrices ? copy.priceOnNote : copy.priceOffNote}</p>
              <p className="mt-3 text-[15px] text-body">{copy.resultIndicative}</p>
            </>
          ) : (
            <p className="mt-3 text-body">{copy.resultEmpty}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={hasList ? surveyHref : "/book-survey?source=estimator"}
              className="btn btn-primary min-h-12 w-full px-4 text-center leading-tight"
              onClick={() => {
                track("estimator_complete", ctaParams());
                track("estimator_to_survey", ctaParams());
              }}
            >
              {hasList ? copy.ctaPrimary : "Book a free survey"}
            </Link>
            <a
              href={whatsappListHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline min-h-12 w-full px-4 text-center leading-tight"
              onClick={() => track("estimator_complete", ctaParams())}
            >
              <WhatsAppIcon size={18} aria-hidden="true" />
              {hasList ? copy.ctaWhatsapp : "Ask on WhatsApp"}
              <span className="sr-only"> (opens WhatsApp)</span>
            </a>
            {rooms.length > 0 && (
              <button type="button" onClick={reset} className="link min-h-11 self-center text-[15px]">
                {copy.reset}
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-slate">{data.note}</p>
      </aside>
    </div>
  );
}
