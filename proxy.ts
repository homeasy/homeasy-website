import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps every address except the real one out of search engines (PRD §13: beta and previews must not be indexed).
 * Decided by the host of each request, so it is right on beta.homeasy.io, on Vercel preview links and on
 * homeasy.io without any setting to remember: test hosts get "X-Robots-Tag: noindex" and a robots.txt that
 * blocks everything; homeasy.io is left alone.
 */
const PRODUCTION_HOSTS = ["homeasy.io", "www.homeasy.io"];

export function proxy(request: NextRequest) {
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (PRODUCTION_HOSTS.includes(host)) return NextResponse.next();
  if (request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex, nofollow" } });
  }
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // pages and text files only: not Next's own assets, images, fonts or the hero renders
  matcher: ["/((?!_next/|api/|fonts/|hero/|images/|logo/|uploads/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|woff2)$).*)"],
};
