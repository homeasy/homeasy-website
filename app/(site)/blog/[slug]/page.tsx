import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Section } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { longDate, plainText, readingMinutes, searchDescription, searchTitle, wordCount } from "@/lib/blog/shared";
import { getPublicArticle, getPublicArticles } from "@/lib/blog/store";
import { flags } from "@/lib/flags";
import { seoMetadata } from "@/lib/seo/meta";
import { site } from "@/lib/site";

type Params = Promise<{ slug: string }>;
const NONE = "no-articles-yet";

/** Published articles are built ahead of time; ones published later are built on their first visit. */
export async function generateStaticParams() {
  const slugs = (await getPublicArticles()).map((a) => ({ slug: a.slug }));
  return slugs.length ? slugs : [{ slug: NONE }]; // the build needs at least one entry; this one answers "not found"
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getPublicArticle(slug);
  if (!a) return { title: "Article not found — Homeasy", robots: { index: false, follow: true } };
  const meta = await seoMetadata(`/blog/${a.slug}`, { title: searchTitle(a), description: searchDescription(a) || undefined });
  return {
    ...meta,
    keywords: a.focus_keyword ? [a.focus_keyword] : undefined,
    authors: [{ name: a.author }],
    ...(a.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: a.published_on ?? undefined,
      modifiedTime: a.updated_at,
      authors: [a.author],
      images: a.cover_url ? [{ url: a.cover_url, alt: a.cover_alt }] : ["/opengraph-image.png"],
    },
  };
}

async function ArticleView({ params }: { params: Params }) {
  const { slug } = await params;
  const a = flags.SHOW_BLOG ? await getPublicArticle(slug) : null;
  if (!a) notFound();
  const more = (await getPublicArticles()).filter((x) => x.id !== a.id).slice(0, 3);
  const minutes = readingMinutes(wordCount(plainText(a.body_html)));
  const url = `${site.url}/blog/${a.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: searchDescription(a) || undefined,
    image: a.cover_url ? [a.cover_url.startsWith("/") ? site.url + a.cover_url : a.cover_url] : undefined,
    datePublished: a.published_on ?? undefined,
    dateModified: a.updated_at,
    author: { "@type": a.author.toLowerCase().includes("homeasy") ? "Organization" : "Person", name: a.author },
    publisher: { "@type": "Organization", name: site.brand, url: site.url },
    mainEntityOfPage: url,
  };
  return (
    <>
      <BreadcrumbJsonLd path={`/blog/${a.slug}`} name={a.title} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div aria-hidden="true" className="read-progress" />
      <article>
        <header className="bg-cloud">
          <div className="container-page py-10 lg:py-16">
            <div className="mx-auto max-w-[760px]">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[14px] text-slate">
                <Link href="/" className="link">
                  Home
                </Link>
                <ChevronRight size={14} aria-hidden="true" />
                <Link href="/blog" className="link">
                  Blog
                </Link>
                {a.category && (
                  <>
                    <ChevronRight size={14} aria-hidden="true" />
                    <span>{a.category}</span>
                  </>
                )}
              </nav>
              <h1 className="mt-4 text-h2 leading-[1.12]">{a.title}</h1>
              {a.excerpt && <p className="mt-4 text-lg text-body">{a.excerpt}</p>}
              <p className="mt-5 text-[15px] text-slate">
                {[a.author && `By ${a.author}`, longDate(a.published_on), `${minutes} min read`].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        </header>
        <div className="container-page py-10 lg:py-14">
          <div className="mx-auto max-w-[760px]">
            {a.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element -- photos are uploaded in the admin and served from storage as they are
              <img src={a.cover_url} alt={a.cover_alt} fetchPriority="high" decoding="async" className="mb-10 aspect-[16/9] w-full rounded-card bg-cloud object-cover" />
            )}
            {/* cleaned on the server when the article is saved (lib/blog/sanitize.ts) */}
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: a.body_html }} />
            <p className="mt-12 border-t border-line pt-6 text-body">
              Want to know what is possible in your own home?{" "}
              <Link href="/book-survey?source=blog" className="link">
                Book a free home survey
              </Link>{" "}
              or see{" "}
              <Link href="/how-it-works" className="link">
                how it works
              </Link>
              .
            </p>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <Section tone="cloud">
          <h2 className="text-h4">More articles</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {more.map((x) => (
              <li key={x.id} className="min-w-0">
                <ArticleCard article={x} heading="h3" />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <CtaBand title="See what your home needs" body="A free home survey, anywhere in Bihar. We check your switchboxes and suggest the right modules." />
    </>
  );
}

export default function ArticlePage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="container-page py-24 text-body">Loading…</div>}>
      <ArticleView params={params} />
    </Suspense>
  );
}
