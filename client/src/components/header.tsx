import { useTheme } from "./theme-provider";
import { Moon, Sun, Menu, Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartButton } from "./shopping-cart";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  // Check if user is admin
  const isAdmin = () => {
    return localStorage.getItem('adminToken') !== null;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (window.location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-white/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => window.location.href = "/"}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/images/logo.png" 
              alt="Pluk & Poot Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-display font-semibold text-xl text-purple-600 dark:text-purple-400">
              Brouwerij Noordergloed
            </span>
          </button>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("verhaal")}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Ons Verhaal
            </button>
            <button
              onClick={() => scrollToSection("producten")}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Producten
            </button>
            <button
              onClick={() => window.location.href = "/workshops"}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Workshops
            </button>
            <button
              onClick={() => scrollToSection("workshop")}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Ramen Pre-order
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <CartButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
