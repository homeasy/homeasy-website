import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { Related } from "@/components/ui/Related";
import { getPublicArticles } from "@/lib/blog/store";
import { flags } from "@/lib/flags";
import { seoMetadata } from "@/lib/seo/meta";

const pageMeta: Metadata = {
  title: "Smart Home Guide for Indian Homes — Homeasy Blog",
  description:
    "A plain smart home guide for Indian homes: how retrofit smart switches work, what a home survey checks, and what to ask before you automate an older house.",
};

export function generateMetadata() {
  return seoMetadata("/blog", pageMeta);
}

const TOPICS = [
  { title: "Retrofit basics", body: "How a smart module fits inside the switchbox you already have, what stays the same on the wall, and where retrofit is not the right answer." },
  { title: "Planning your home", body: "Which rooms and appliances to start with, what our free home survey checks, and how a written quote is worked out." },
  { title: "Living with it", body: "Rooms, scenes and schedules in the app, sharing control with family, and what happens when the Wi-Fi or the power goes off." },
  { title: "For professionals", body: "Notes for interior designers, builders and electricians who want to add smart control without changing the switchboards a client chose." },
];

/** Blog list. Shows the PUBLISHED articles (written in /admin/blog, live after Publish). */
export default async function BlogPage() {
  if (!flags.SHOW_BLOG) notFound();
  const articles = await getPublicArticles();
  return (
    <>
      <BreadcrumbJsonLd path="/blog" />
      <PageHero
        eyebrow="Blog"
        title="The Homeasy blog"
        sub="A plain smart home guide for Indian homes, written by the people who do the surveys and installations. No jargon, no sales talk: how retrofit works, what it needs, and what to check before you decide."
      >
        <Link href="/how-it-works" className="btn btn-primary min-h-12 px-6">
          See how retrofit works
        </Link>
        <Link href="/faq" className="btn btn-outline min-h-12 px-6">
          Read the FAQ
        </Link>
      </PageHero>

      <Section>
        <SectionHeading title="Latest articles" sub={articles.length ? "Newest first." : undefined} />
        {articles.length ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {articles.map((a) => (
              <li key={a.id} className="min-w-0">
                <ArticleCard article={a} heading="h3" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 max-w-[720px] text-body">
            The first articles are being written. Until they are here, the{" "}
            <Link href="/how-it-works" className="link">
              how it works
            </Link>{" "}
            page and the{" "}
            <Link href="/faq" className="link">
              FAQ
            </Link>{" "}
            answer the questions we hear most often.
          </p>
        )}
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What we write about" sub="Every article answers a real question from a home survey, a customer call or a site visit." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {TOPICS.map((t) => (
            <li key={t.title} className="min-w-0">
              <Card className="h-full">
                <h3 className="text-h4">{t.title}</h3>
                <p className="mt-2 text-body">{t.body}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[720px] text-body">
          We write only what we can stand behind. Where something is planned and not available yet, the article says so, and the{" "}
          <Link href="/roadmap" className="link">
            roadmap
          </Link>{" "}
          shows where it stands.
        </p>
      </Section>

      <Related paths={["/how-it-works", "/products", "/installation"]} />
      <CtaBand title="Have a question about your own home?" body="Book a free home survey. We check your switchboxes and tell you plainly what is possible." />
    </>
  );
}
