import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductShowcase } from "@/components/product-showcase";
import { RamenPreorderFixed } from "@/components/ramen-preorder-fixed";
import { StorySection } from "@/components/story-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <StorySection />
      <ProductShowcase />
      <RamenPreorder />
      <ContactSection />
      <Footer />
    </div>
  );
}
