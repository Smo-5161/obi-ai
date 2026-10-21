import { site } from "@/lib/site";
import PixelDivider from "./sections/PixelDivider";
import {
  HeroSection,
  MetricsSection,
  HowItWorksSection,
  FeaturesSection,
  PricingSection,
  CtaSection,
} from "./sections/sections";

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

      <HeroSection />
      <PixelDivider />
      <MetricsSection />
      <PixelDivider flip />
      <HowItWorksSection />
      <PixelDivider />
      <FeaturesSection />
      <PixelDivider flip />
      <PricingSection />
      <PixelDivider />
      <CtaSection />
    </>
  );
}
