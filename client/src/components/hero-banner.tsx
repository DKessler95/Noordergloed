import { Play, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function HeroBanner() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const scrollToProducts = () => {
    const element = document.getElementById("featured-products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 brewery-hero-gradient">
        {/* Simple gradient background without center effect */}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10 max-w-4xl px-6">
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            <span className="block text-orange-400">Brouwerij</span>
            <span className="block">Noordergloed</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-slide-up">
            Handgemaakte kombucha uit het hart van Groningen. 
            Van lokale ingrediënten naar pure smaakbeleving.
          </p>
          
          <div className="flex justify-center animate-slide-up">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = "/webshop"}
            >
              Ontdek onze producten
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollToProducts}
          className="text-white/80 hover:text-white flex flex-col items-center animate-bounce"
        >
          <ArrowDown className="w-6 h-6" />
          <span className="text-sm mt-1">Scroll voor meer</span>
        </Button>
      </div>
    </section>
  );
}