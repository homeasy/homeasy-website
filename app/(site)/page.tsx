import { Hero } from "@/components/hero/Hero";
import {
  Appliances,
  AppSection,
  Business,
  CtaBand,
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
      <Hero tagline={site.tagline} photoHref={site.whatsappHref("photo")} />
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
