import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { ProductCarousel } from "@/components/product-carousel";
import { StorySection } from "@/components/story-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      <Header />
      <HeroBanner />
      <ProductCarousel />
      <StorySection />
      <ContactSection />
      <Footer />
    </div>
  );
}
