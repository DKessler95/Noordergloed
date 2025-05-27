import { MapPin, Heart } from "lucide-react";

export function StorySection() {
  return (
    <section id="verhaal" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Ons Verhaal
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Het begon allemaal tijdens onze wandelingen door Groningen. Elfie en ik ontdekten 
                de schitterende vlierbloesem bij de Hamburgervijver, en ik raakte gefascineerd 
                door de mogelijkheden van deze natuurlijke ingrediënten.
              </p>
              
              <p>
                Vanuit onze basis aan de Star Numanstraat experimenteren we met seizoensgebonden 
                ingrediënten. Elke fles siroop is handgemaakt met zorg voor kwaliteit en respect 
                voor de natuur om ons heen.
              </p>
              
              <p>
                Elfie is niet alleen mijn trouwe metgezel, maar ook mijn inspiratiebron. 
                Samen ontdekken we de beste plekjes in Groningen voor onze ingrediënten, 
                van rozenblaadjes uit onze eigen tuin tot wilde kruiden in de omgeving.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Natuurlijk</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">30+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Schermen per liter</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">4</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Dagen uittrektijd</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">1</div>
                  <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Elfie</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551582045-6ec9c11d8697?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000" 
                alt="Portret met Elfie bij de Hamburgervijver" 
                className="w-full h-auto" 
              />
              
              {/* Floating badges */}
              <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Groningen</span>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Team Elfie</span>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-20" />
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full animate-pulse opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
