import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { WelcomeSection } from "@/components/welcome-section";
import { ProductCarousel } from "@/components/product-carousel";
import { WorkshopsSection } from "@/components/workshops-section";
import { RamenSection } from "@/components/ramen-section-fixed";
import { AdditionalSections } from "@/components/additional-sections";

import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      <Header />
      <HeroBanner />
      <WelcomeSection />
      <ProductCarousel />
      <WorkshopsSection />
      <RamenSection />
      <AdditionalSections />
      <Footer />
    </div>
  );
}
