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
      <div className="landing-page">
        <HeroSection />
        <MetricsSection />
        <section data-section className="landing-brain-section">
          <div className="mx-auto w-full max-w-7xl px-6 py-24">
            <div className="landing-section-heading">
              <p className="landing-overline st-item">LA MÉMOIRE EN ACTION</p>
              <h2 className="st-item mt-3">Une réponse, reliée au savoir de l&apos;équipe.</h2>
              <p className="st-item mt-4 max-w-2xl">
                Explorez un Brain de démonstration et posez vos questions à Omi Companion,
                à partir des procédures réellement capturées.
              </p>
            </div>
            <div className="st-item mt-12">
              <BrainDemo />
            </div>
          </div>
        </section>
        <HowItWorksSection />
        <DemoVideoSection />
        <PricingSection />
        <LatestPostsSection />
        <CtaSection />
      </div>
    </>
  );
}
