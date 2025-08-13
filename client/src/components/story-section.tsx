import { MapPin, Heart, Trees, Flower } from "lucide-react";

export function StorySection() {
  return (
    <section id="verhaal" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Welkom bij Brouwerij Noordergloed
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Bij Brouwerij Noordergloed draait alles om verbinden, terug naar de natuur en samen genieten van pure smaken. 
                Vanuit mijn werkplek aan de Star Numanstraat in Groningen maak ik unieke kombucha, jams, siropen en nog veel meer. 
                Allemaal met ingrediënten uit de regio, met aandacht voor het seizoen en respect voor de omgeving.
              </p>
              
              <p>
                Wat je hier vindt, proef je niet in de winkel: verrassende smaken en combinaties die je meenemen naar het Groningse landschap. 
                Via kleinschalige workshops nodig ik je uit om het plezier van samen ontdekken en creëren te ervaren, 
                en zo de verbinding met natuur en elkaar te versterken.
              </p>
              
              <p>
                Dit is een plek waar mensen samenkomen, delen en zich opnieuw laten inspireren. 
                Voel je welkom om aan te sluiten bij een workshop, op ontdekkingstocht te gaan of gewoon te komen proeven van al het moois dat Brouwerij Noordergloed te bieden heeft!
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trees className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Natuurlijk</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flower className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">30+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Schermen per liter</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/dc_foto.jpg" 
                alt="Portret met mijn honden in de tuin" 
                className="w-full h-auto" 
              />
              
              {/* Floating badges */}
              <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Groningen</span>
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
