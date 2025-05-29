import { ArrowLeft, Clock, Users, Star, Utensils, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function ChickenShoyuRamen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Terug naar Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="relative bg-gradient-to-br from-amber-100 to-orange-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <Utensils className="w-24 h-24 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Chicken Shoyu Ramen
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Authentieke Japanse ramen ervaring
                </p>
              </div>
            </div>
            
            {/* Product Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">2+ uur koken</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Verse bouillon</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Max 12 personen</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Intieme ervaring</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Ramen Ervaring
                </Badge>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(Authentiek Japans)</span>
                </div>
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Chicken Shoyu Ramen Ervaring
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Beleef een authentieke Japanse ramen ervaring in het hart van Groningen. 
                Onze Chicken Shoyu Ramen wordt met liefde bereid volgens traditionele recepten, 
                met verse ingrediënten en een bouillon die uren heeft getrokken.
              </p>
            </div>

            {/* What's Included */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Wat is inbegrepen:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Verse Chicken Shoyu bouillon (2+ uur gekookt)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Handgemaakte ramen noedels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Malse kip, ajitsuke ei en verse groenten</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Traditionele toppings en bijgerechten</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Culturele uitleg over ramen traditie</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pricing & Booking */}
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">€25,00 per persoon</p>
                    <p className="text-amber-100">Inclusief alle ingrediënten</p>
                  </div>
                  <Calendar className="w-8 h-8 text-amber-100" />
                </div>
                
                <div className="space-y-3 mb-6">
                  <p className="text-sm text-amber-100">
                    <strong>Wanneer:</strong> Alleen op vrijdagavonden
                  </p>
                  <p className="text-sm text-amber-100">
                    <strong>Tijd:</strong> 18:00 - 21:00 (inclusief voorbereiding)
                  </p>
                  <p className="text-sm text-amber-100">
                    <strong>Locatie:</strong> Star Numanstraat, Groningen
                  </p>
                </div>

                <Link href="/#ramen">
                  <Button 
                    className="w-full bg-white text-amber-600 hover:bg-amber-50 font-semibold py-3"
                    size="lg"
                  >
                    Reserveer Nu
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="bg-amber-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                Belangrijk om te weten:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Minimum 6 personen, maximum 12 personen per sessie</li>
                <li>• Reservering wordt automatisch bevestigd bij 6+ deelnemers</li>
                <li>• Geschikt voor alle leeftijden en diëten (vegetarische optie beschikbaar)</li>
                <li>• Annulering tot 48 uur van tevoren mogelijk</li>
                <li>• Alle benodigde materialen worden verzorgd</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}