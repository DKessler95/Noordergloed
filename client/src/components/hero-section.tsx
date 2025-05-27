import { ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Ambachtelijke Siroop
            <span className="block text-yellow-300">uit Groningen</span>
          </h1>
          
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
            <Heart className="text-yellow-300 mr-2 w-5 h-5" />
            <span className="text-white font-medium">Met liefde gemaakt door Elfie</span>
          </div>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Van verse vlierbloesem uit de Hamburgervijver tot rozenblaadjes uit onze eigen tuin. 
            Elke fles vertelt een verhaal van ambacht en passie.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection("producten")}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Bekijk Producten
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("verhaal")}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Ons Verhaal
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-white text-2xl" />
      </div>
    </section>
  );
}
