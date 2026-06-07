import HeroSlider from "./HeroSlider";
import AboutCompany from "./AboutCompany";
import Services from "./Services";
import WhyChooseUs from "./WhyChooseUs";
import Process from "./Process";
import Testimonials from "./Testimonials";
import FAQSection from "./FAQSection";
import OperationalCities from "./OperationalCities";
import CallToAction from "./CallToAction";
import NationalCoverageMap from "./NationalCoverageMap";
import { operationalCities } from "@/lib/operational-cities";
// import AboutCompany from "./AboutCompany";

export default function HomeSections() {
  return (
    <>
      <HeroSlider />
      <AboutCompany />
      <Services />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <FAQSection />
      <OperationalCities
        title="Operational Cities"
        subtitle="Browse every service location we support across India with the same clean city-card layout."
        cities={operationalCities}
      />
      <CallToAction />
      <NationalCoverageMap />
    </>
  );
}
