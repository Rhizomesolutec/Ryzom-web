import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";
import WhyRyzom from "@/components/WhyRyzom";
import Contact from "@/components/Contact";
import LivingCore from "@/components/LivingCore";

export default function Home() {
  return (
    <>
      {/* Living Core Scroll Guided Narrator Overlay */}
      <LivingCore />

      {/* Hero Intro Section */}
      <Hero />

      {/* Interactive Growth Chain Methodology Section */}
      <WhyRyzom />

      {/* Signature Root Growth & Services Section */}
      <Services />

      {/* Case Studies Portfolio Section */}
      <Work />

      {/* About Philosophy & Timeline Section */}
      <About />

      {/* Contact Form & World Tech Hotspots Section */}
      <Contact />
    </>
  );
}

