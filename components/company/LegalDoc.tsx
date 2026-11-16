import Link from "next/link";
import type { ReactNode } from "react";
import type { LegalId } from "@/lib/content/docs";
import { getContent } from "@/lib/content/store";
import { getSite } from "@/lib/site-live";
import { LegalPage } from "./LegalPage";

/** Only ordinary web, page, email and phone links are allowed in policy text. */
const safeHref = (href: string) => (/^(https?:\/\/|\/|#|mailto:|tel:)/.test(href) ? href : null);

/** **bold** and [text](link) inside a line. */
function inline(text: string, key: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={`${key}-${i}`}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    const href = link && safeHref(link[2]);
    if (link && href) {
      return href.startsWith("/") ? (
        <Link key={`${key}-${i}`} href={href} className="link">
          {link[1]}
        </Link>
      ) : (
        <a key={`${key}-${i}`} href={href} className="link">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

/** Turns the simple policy text format into headings, paragraphs and bullet lists. */
function Body({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, n) => {
        const key = `b${n}`;
        if (block.startsWith("### ")) return <h3 key={key}>{inline(block.slice(4), key)}</h3>;
        if (block.startsWith("## ")) return <h2 key={key}>{inline(block.slice(3), key)}</h2>;
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={key}>
              {lines.map((l, i) => (
                <li key={i}>{inline(l.slice(2), `${key}-${i}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key}>
            {lines.map((l, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {inline(l, `${key}-${i}`)}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** A policy page whose text comes from Admin → Policies & terms (published copy). */
export async function LegalDoc({ id }: { id: LegalId }) {
  const [legal, site] = await Promise.all([getContent("legal"), getSite()]);
  const doc = legal[id];
  const tokens: Record<string, string> = {
    phone: site.contact.phoneDisplay,
    tel: site.contact.phoneE164,
    email: site.contact.email,
    address: site.fullAddress,
    hours: site.contact.hours,
  };
  const body = doc.body.replace(/\{(\w+)\}/g, (match, name: string) => tokens[name] ?? match);
  return (
    <LegalPage title={doc.title} intro={doc.intro} draft={doc.draft} dates={doc.dates || undefined}>
      <Body text={body} />
    </LegalPage>
  );
}
