import { Hero } from "@/components/hero/Hero";
import {
  Appliances,
  AppSection,
  Business,
  CtaBand,
  EarlyAccess,
  FounderNote,
  HomeFaq,
  HowItWorks,
  IndianHomes,
  Packages,
  Parents,
  Problem,
  Process,
  PromiseSection,
  ServiceArea,
  Switches,
} from "@/components/home/sections";
import { getContent } from "@/lib/content/store";
import { flags } from "@/lib/flags";
import { seoMetadata } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-live";

/** Home (PRD §8.1). Section copy and the show/hide switches are in data/home.json. The real-installs gallery (S10) appears after the pilot. */
export function generateMetadata() {
  return seoMetadata("/");
}

export default async function Home() {
  const site = await getSite();
  const show = (await getContent("home")).sections; // switched on/off in Admin → Homepage
  return (
    <>
      {/* the hero photo is the largest thing on screen: fetch it first */}
      <link rel="preload" as="image" href="/hero/mobile/ambient.jpg" media="(max-width: 1023px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/hero/desktop/ambient.jpg" media="(min-width: 1024px)" fetchPriority="high" />
      <Hero tagline={site.tagline} photoHref={site.whatsappHref("photo")} />
      {show.early && !flags.LAUNCHED && <EarlyAccess />}
      {show.problem && <Problem />}
      {show.how && <HowItWorks />}
      {show.appliances && <Appliances />}
      {show.process && <Process />}
      {show.promise && <PromiseSection />}
      {show.switches && <Switches />}
      {show.parents && <Parents />}
      {show.indian && <IndianHomes />}
      {show.packages && <Packages />}
      {show.app && <AppSection />}
      {show.business && <Business />}
      {show.area && <ServiceArea />}
      {show.founder && <FounderNote />}
      {show.faq && <HomeFaq />}
      <CtaBand />
    </>
  );
}
