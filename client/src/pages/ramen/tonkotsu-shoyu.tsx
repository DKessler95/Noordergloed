import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, ChefHat, Star, Utensils, Flame } from "lucide-react";

export default function TonkotsuShoyuRamenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-500 text-white text-lg px-4 py-2">
            Tonkotsu Shoyu Ramen - Premium
          </Badge>
          <h1 className="font-display text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Tonkotsu Shoyu Ramen</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            De koning van alle ramen - rijke varkensbouillon met shoyu tare en premium toppings
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Image and Overview */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-red-200 to-pink-200 flex items-center justify-center">
              <div className="text-center text-red-600">
                <ChefHat className="w-24 h-24 mx-auto mb-4" />
                <p className="text-lg font-display">Premium Tonkotsu Ramen</p>
              </div>
            </div>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <Utensils className="w-5 h-5 mr-2" />
                  Premium Ingrediënten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-red-500 mr-2" />
                  <span>36-uurs getrokken tonkotsu bouillon</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-red-500 mr-2" />
                  <span>Premium varkensvlees van lokale boer</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-red-500 mr-2" />
                  <span>Extra dikke ramen noedels</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-red-500 mr-2" />
                  <span>Dubbel gemarineerd ajitsuke tamago</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-red-500 mr-2" />
                  <span>Chashu varkensvlees (12u gemarineerd)</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-red-500 mr-2" />
                  <span>Premium toppings: menma, nori, takana</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-gradient-to-br from-red-50/50 to-pink-50/50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <Flame className="w-5 h-5 mr-2" />
                  Waarom €15?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tonkotsu ramen vereist premium varkensbotten, 36+ uur koken, 
                  en duurste ingrediënten. Het resultaat is een rijke, romige bouillon 
                  die de ultieme ramen ervaring biedt.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right - Preparation Process */}
          <div className="space-y-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Intensief Bereidingsproces
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">Dag 1-2: Tonkotsu Bouillon</h3>
                  <p className="text-muted-foreground">
                    Premium varkensbotten worden 36+ uur op hoge temperatuur gekookt 
                    tot de bouillon melkwit en romig wordt. Dit is een intensief proces 
                    dat constante aandacht vereist.
                  </p>
                </div>

                <div className="border-l-4 border-red-400 pl-4">
                  <h3 className="font-bold text-lg mb-2">Dag 2: Chashu Bereiding</h3>
                  <p className="text-muted-foreground">
                    Varkensvlees wordt 12+ uur gemarineerd in een speciale tare van 
                    soja, mirin, sake en geheime kruiden, daarna langzaam gebraden.
                  </p>
                </div>

                <div className="border-l-4 border-red-300 pl-4">
                  <h3 className="font-bold text-lg mb-2">Workshop Avond</h3>
                  <p className="text-muted-foreground">
                    Samen assembleren we de perfecte tonkotsu ramen met alle premium 
                    toppings en leren over de kunst van deze complexe ramen stijl.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <Clock className="w-5 h-5 mr-2" />
                  Planning & Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dag:</span>
                  <span>Alleen vrijdagavond</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tijd:</span>
                  <span>17:00 - 19:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Duur workshop:</span>
                  <span>±2 uur inclusief eten</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Min. deelnemers:</span>
                  <span>6 personen</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Max. deelnemers:</span>
                  <span>12 personen</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-3">
                  <span>Prijs per persoon:</span>
                  <span className="text-red-600 text-xl">€15,00</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => window.location.href = "/#ramen"}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg py-3 hover:scale-105 transition-all duration-300"
            >
              Meld je nu aan voor Premium Ramen
            </Button>
          </div>
        </div>

        {/* Comparison Section */}
        <Card className="mb-16 border-red-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-red-700">Chicken Shoyu vs Tonkotsu Shoyu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <h3 className="font-bold text-xl mb-4 text-orange-600">Chicken Shoyu - €12,50</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Lichtere, heldere bouillon (24u)</li>
                  <li>• Kip van lokale boer</li>
                  <li>• Klassieke shoyu smaak</li>
                  <li>• Perfect voor beginners</li>
                  <li>• Authentiek en toegankelijk</li>
                </ul>
              </div>
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <h3 className="font-bold text-xl mb-4 text-red-600">Tonkotsu Shoyu - €15,00</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Rijke, romige bouillon (36u)</li>
                  <li>• Premium varkensvlees</li>
                  <li>• Complexe, diepe smaak</li>
                  <li>• Voor ramen liefhebbers</li>
                  <li>• Ultieme ramen ervaring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ervaar de koning van alle ramen</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Voor echte ramen liefhebbers die de ultieme smaakervaring zoeken
          </p>
          <Button 
            onClick={() => window.location.href = "/#ramen"}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-12 py-4 text-xl hover:scale-105 transition-all duration-300"
          >
            Naar Premium Aanmelding
          </Button>
        </div>
      </div>
    </div>
  );
}