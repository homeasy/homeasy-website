import Link from "next/link";

export const metadata = { title: "Page not found — Homeasy" };

/** PRD §8.17 / §25.13 */
export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center lg:py-32">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate">404</p>
      <h1 className="mt-3 text-h1 leading-tight">This page isn&apos;t wired up.</h1>
      <p className="mt-4 max-w-md text-body">
        The page you&apos;re looking for doesn&apos;t exist yet, or it has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-secondary">
          Go home
        </Link>
        <Link href="/book-survey" className="btn btn-primary">
          Book a free survey
        </Link>
      </div>
    </section>
  );
}
