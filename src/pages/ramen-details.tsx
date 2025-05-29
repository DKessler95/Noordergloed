import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, ChefHat, Calendar, Mail, MapPin, Truck, Users } from "lucide-react";


export default function RamenDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar home
            </Button>
          </Link>
          
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Chicken Shoyu Ramen
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Alles wat je wilt weten over ons ramen proces, bereiding en ophalen
          </p>
        </div>

        {/* Bereidingsproces Foto's */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64">
              <img 
                src="/images/IMG20250123160935.jpg" 
                alt="Voorbereiding van verse kip voor de ramen bouillon" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-semibold text-lg">Verse ingrediënten</h3>
                  <p className="text-sm opacity-90">Voorbereiding van verse kip</p>
                </div>
              </div>
            </div>
            <div className="relative h-64">
              <img 
                src="/images/IMG20250123170544.jpg" 
                alt="Het kookproces van de ramen bouillon in de keuken" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-semibold text-lg">Traditionele bereiding</h3>
                  <p className="text-sm opacity-90">Uren lang sudderen voor rijke smaak</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Process Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Het bereidingsproces
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Dag 1: Bouillon maken
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  We beginnen de avond van te voren met het maken van de bouillon. Kippenbotten, vlees, vel, poten, 
                  ui, gember en knoflook worden 24+ uur zachtjes gekookt voor die diepe, 
                  en collageen rijke smaak die onze ramen zo bijzonder maakt.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Dag 2: Verse bereiding
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Op de dag van levering bereiden we alle toppings vers: gemarineerde eieren 
                  die 24 uur in onze speciale marinade hebben gelegen, gepaneerde kip, 
                  verse noedels en alle garnituren. Elke kom wordt op bestelling samengesteld.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
                Wat maakt onze ramen speciaal?
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                  <li>• <strong>24+ uur gekookte bouillon</strong> voor diepe en stevige smaak</li>
                  <li>• <strong>Authentieke ingrediënten</strong> direct uit Japan</li>
                  <li>• <strong>Verse noedels</strong> - niet uit een pakje</li>
                  <li>• <strong>24h gemarineerde eieren</strong> - perfecte textuur</li>
                </ul>
                <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                  <li>• <strong>Handgesneden groenten</strong> - altijd vers</li>
                  <li>• <strong>Geheime tare saus</strong> - ons eigen recept</li>
                  <li>• <strong>Traditionele methoden</strong> - zoals in Japan</li>
                  <li>• <strong>Kleine batches</strong> - kwaliteit boven kwantiteit</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What you get section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Wat krijg je precies?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  In elke kom ramen:
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Verse ramen noedels</strong> - Gemaakt door Damian bij hand.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Rijke chicken shoyu bouillon</strong> - 24+ uur getrokken, vol van smaak
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Ajitsuke tamago</strong> - Perfect gemarineerde eieren met romige dooier
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Gepaneerde kip</strong> - Mals, sappig en vol van smaak
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Plus alle garnituren:
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Verse lente-uitjes</strong> - Voor die perfecte bite en frisheid
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Nori zeewier</strong> - Authentieke Japanse oceaansmaak
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Menma bamboe & andere groenten</strong> - Traditionele knapperige toppings
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Speciale tare saus</strong> - Ons geheime recept voor de perfecte smaak
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup process */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Hoe werkt het ophalen?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">1. Reserveren</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Kies een vrijdag en bestel minimaal 4 dagen van tevoren via onze website. (mits nog beschikbaar) 
                  We hebben beperkte plekken per sessie.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">2. Bevestiging</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Je ontvangt een bevestiging met het exacte ophaaltijdstip, locatie en 
                  eventuele bijzondere instructies.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">3. Ophalen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Haal je bestelling af op de afgesproken tijd. Alles is warm verpakt 
                  en klaar om mee te nemen en direct te eten.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Bezorging helaas nog niet mogelijk
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Wij bezorgen helaas niet, wij willen ervoor zorgen dat je ramen ervaring authentiek blijft. En het mensenlijk contact behouden.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Groepsbestellingen
                </h3>
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  Bij 6+ personen wordt je bestelling automatisch bevestigd. 
                  Perfect voor familie-avonden of vriendendiner! Maximaal 12 personen per sessie.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important info */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Belangrijk om te weten:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-red-800 dark:text-red-200 text-sm space-y-2">
                  <li>• Alleen beschikbaar op vrijdagen</li>
                  <li>• Maximaal 12 personen per sessie</li>
                  <li>• Minimaal 2 dagen van tevoren bestellen</li>
                </ul>
                <ul className="text-red-800 dark:text-red-200 text-sm space-y-2">
                  <li>• Bij annulering binnen 24 uur geen terugbetaling</li>
                  <li>• Elke kom wordt vers bereid volgens Japanse traditie</li>
                  <li>• Prijs: €12,50 per persoon (bezorging +€1)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Klaar om te bestellen?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ga terug naar de homepage en reserveer je plek voor onze next ramen sessie!
            </p>
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Naar bestelpagina
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}