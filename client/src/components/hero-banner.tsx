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
        {/* Video will be placed here */}
        {!isVideoPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Placeholder for video thumbnail */}
              <div className="w-96 h-64 bg-gradient-to-br from-orange-400/20 to-amber-600/30 rounded-2xl border-2 border-orange-500/30 flex items-center justify-center backdrop-blur-sm">
                <Button
                  onClick={() => setIsVideoPlaying(true)}
                  size="lg"
                  className="bg-white/90 text-orange-600 hover:bg-white hover:scale-110 transition-all duration-300 rounded-full w-16 h-16 p-0"
                >
                  <Play className="w-6 h-6 ml-1" />
                </Button>
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-amber-400/50 rounded-full animate-float"></div>
            </div>
          </div>
        ) : (
          // Placeholder video element - will be replaced with actual video
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-amber-800 flex items-center justify-center">
            <div className="text-white/80 text-center">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p>Video wordt geladen...</p>
            </div>
          </div>
        )}
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = "/webshop"}
            >
              Ontdek Onze Kombucha
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm"
              onClick={() => window.location.href = "/workshops"}
            >
              Bezoek Workshop
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