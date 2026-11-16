import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CircleCheck, Info } from "lucide-react";
import { Section } from "@/components/ui";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = { title: "Order received — Homeasy", robots: { index: false } };

async function Message({ searchParams }: { searchParams: Promise<{ ref?: string; pay?: string }> }) {
  const { ref = "", pay = "" } = await searchParams;
  const safeRef = /^HO-[0-9A-Z]{6}$/.test(ref) ? ref : "";
  const paid = pay === "done";
  const Icon = paid ? CircleCheck : Info;
  return (
    <div className="mx-auto max-w-[640px] rounded-card border border-line bg-white p-6 text-center sm:p-10">
      <Icon size={44} aria-hidden="true" className={`mx-auto ${paid ? "text-success" : "text-link"}`} />
      <h1 className="mt-4 text-h3 leading-tight">
        {paid ? "Thank you. Your order is confirmed." : pay === "later" ? "Order received" : "We are checking your payment"}
      </h1>
      {safeRef && (
        <p className="mt-3 text-body">
          Your order number is <strong className="text-ink">{safeRef}</strong>.
        </p>
      )}
      <p className="mt-3 text-body">
        {paid
          ? "We will call or WhatsApp you to confirm the delivery date."
          : pay === "later"
            ? `We will call or WhatsApp you ${site.contact.leadResponse} to confirm your order and arrange payment.`
            : "If money left your account, your order is safe. We will confirm it shortly. You do not need to pay again."}
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={whatsappHref("general")} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-12 px-6">
          WhatsApp us
        </a>
        <Link href="/" className="btn btn-outline min-h-12 px-6">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function OrderPlacedPage({ searchParams }: { searchParams: Promise<{ ref?: string; pay?: string }> }) {
  return (
    <Section tone="cloud">
      <Suspense fallback={<p className="text-center text-body">Loading…</p>}>
        <Message searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}
