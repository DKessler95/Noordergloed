import { Leaf, Instagram, Facebook, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <Leaf className="text-white text-xl w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl">Pluk & Poot</span>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Handgemaakte ambachtelijke siroop uit het hart van Groningen. 
              Met liefde bereid door Elfie en mij, van lokale ingrediënten naar jouw glas.
            </p>
            
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Producten</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("producten")}
                  className="hover:text-yellow-400 transition-colors"
                >
                  Vlierbloesem Siroop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("producten")}
                  className="hover:text-pink-400 transition-colors"
                >
                  Rozen Siroop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("ramen")}
                  className="hover:text-purple-400 transition-colors"
                >
                  Ramen Pre-order
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("producten")}
                  className="hover:text-purple-400 transition-colors"
                >
                  Seizoensspecials
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Informatie</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("verhaal")}
                  className="hover:text-purple-400 transition-colors"
                >
                  Over ons
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Bestelvoorwaarden
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-purple-400 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Pluk & Poot. Handgemaakt in Groningen, nabij de iconische Hamburgervijver.
          </p>
          <p className="text-gray-500 text-xs mt-4 md:mt-0 flex items-center">
            <Heart className="w-3 h-3 mr-1" />
            Met trots gemaakt door Team Elfie
          </p>
        </div>
      </div>
    </footer>
  );
}
