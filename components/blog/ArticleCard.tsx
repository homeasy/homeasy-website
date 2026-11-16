import Link from "next/link";
import { longDate, plainText, readingMinutes, wordCount, type Article } from "@/lib/blog/shared";

/** One article on the blog list and under "More articles". */
export function ArticleCard({ article: a, heading: Heading = "h2" }: { article: Article; heading?: "h2" | "h3" }) {
  const minutes = readingMinutes(wordCount(plainText(a.body_html)));
  return (
    <Link href={`/blog/${a.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white no-underline transition-colors hover:border-navy focus-visible:outline-offset-4">
      {a.cover_url ? (
        <span className="block overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- photos are uploaded in the admin and served from storage as they are */}
          <img src={a.cover_url} alt={a.cover_alt} loading="lazy" decoding="async" className="fx-zoom aspect-[16/9] w-full bg-cloud object-cover" />
        </span>
      ) : (
        <span aria-hidden="true" className="flex aspect-[16/9] w-full items-end bg-tint p-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy">
          {a.category || "Homeasy blog"}
        </span>
      )}
      <span className="flex flex-1 flex-col p-5 sm:p-6">
        {a.category && a.cover_url && <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{a.category}</span>}
        <Heading className="mt-1 text-[1.1875rem] font-semibold leading-snug text-ink group-hover:underline">{a.title}</Heading>
        {a.excerpt && <span className="mt-2 text-[15px] text-body">{a.excerpt}</span>}
        <span className="mt-auto pt-4 text-[14px] text-slate">
          {[longDate(a.published_on), `${minutes} min read`].filter(Boolean).join(" · ")}
        </span>
      </span>
    </Link>
  );
}
