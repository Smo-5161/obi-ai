import { site } from "@/lib/site";
import SectionTransition from "./SectionTransition";
import {
  HeroSection,
  MetricsSection,
  HowItWorksSection,
  PricingSection,
  CtaSection,
} from "./sections/sections";
import { DemoVideoSection } from "./sections/DemoVideoSection";
import { LatestPostsSection } from "./sections/LatestPostsSection";
import BrainDemo from "./sections/BrainDemo";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
      description: site.description,
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: site.description,
      offers: {
        "@type": "Offer",
        price: "29",
        priceCurrency: "EUR",
        description: "Plan Team — par utilisateur et par mois",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SectionTransition />
      <HeroSection />
      <MetricsSection />
      <HowItWorksSection />
      <DemoVideoSection />
      <section data-section className="w-full bg-background">
        <div className="mx-auto w-full max-w-6xl px-6 py-14">
          <h2 className="st-item mt-1 text-3xl font-bold tracking-tight text-text-strong">Omi en situation</h2>
          <p className="st-item mt-3 max-w-2xl text-foreground">
            Un Brain de démonstration avec deux SOP réelles et l&apos;agent Omi : explorez la
            base de connaissances et posez vos questions, sans inscription.
          </p>
          <div className="st-item mt-8">
            <BrainDemo />
          </div>
        </div>
      </section>
      <LatestPostsSection />
      <PricingSection />
      <CtaSection />
    </>
  );
}
