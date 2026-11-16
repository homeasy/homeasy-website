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
import home from "@/data/home.json";
import { site, whatsappHref } from "@/lib/site";

/** Home (PRD §8.1). Section copy and the show/hide switches are in data/home.json. The real-installs gallery (S10) appears after the pilot. */
export default function Home() {
  const show = home.sections; // switch sections on/off in data/home.json
  return (
    <>
      <Hero tagline={site.tagline} photoHref={whatsappHref("photo")} />
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
