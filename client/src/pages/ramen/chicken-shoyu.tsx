import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, ChefHat, Star, Utensils } from "lucide-react";

export default function ChickenShoyuRamenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20">
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
          <Badge className="mb-4 bg-orange-500 text-white text-lg px-4 py-2">
            Chicken Shoyu Ramen
          </Badge>
          <h1 className="font-display text-5xl font-bold mb-6">
            <span className="brewery-text-gradient">Traditionele Chicken Shoyu Ramen</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Een authentieke Japanse ramen ervaring met verse ingrediënten en 24+ uur getrokken bouillon
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Image and Overview */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/images/chicken-shoyu-ramen.jpg"
                alt="Chicken Shoyu Ramen"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800';
                }}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-orange-600" />
                  Wat je krijgt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Een complete ramen kom met alle toppings</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Verse ramen noedels</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Rijke shoyu bouillon (24+ uur getrokken)</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Krokante kip van lokale boer</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Ajitsuke tamago (gemarineerd ei)</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Verse toppings: nori, lente-ui, moyashi</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Preparation Process */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-2 text-orange-600" />
                  Bereidingsproces
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">Dag 1: Bouillon</h3>
                  <p className="text-muted-foreground">
                    We beginnen met het maken van de diepe, rijke shoyu bouillon. Kippenbotten, 
                    groenten en aromatieken worden 24+ uur zachtjes getrokken voor de perfecte smaak.
                  </p>
                </div>

                <div className="border-l-4 border-orange-400 pl-4">
                  <h3 className="font-bold text-lg mb-2">Dag 2: Voorbereidingen</h3>
                  <p className="text-muted-foreground">
                    Verse noedels worden gemaakt, kip wordt gemarineerd en gekruid, 
                    eieren worden perfect gekookt en gemarineerd in tare.
                  </p>
                </div>

                <div className="border-l-4 border-orange-300 pl-4">
                  <h3 className="font-bold text-lg mb-2">Avond van de Workshop</h3>
                  <p className="text-muted-foreground">
                    Samen maken we de ramen af: kip wordt gegrild, noedels gekookt, 
                    en elke kom wordt kunstig opgemaakt met alle toppings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
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
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Prijs per persoon:</span>
                  <span className="text-orange-600">€12,50</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => window.location.href = "/#ramen"}
              className="w-full brewery-gradient text-white text-lg py-3 hover:scale-105 transition-all duration-300"
            >
              Meld je nu aan voor Ramen Avond
            </Button>
          </div>
        </div>

        {/* Ingredients Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Ingrediënten & Herkomst</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-3 text-orange-600">Lokale Kip</h3>
                <p className="text-muted-foreground">
                  Vers van biologische boerderij in Groningen. Geen antibiotica, 
                  vrije uitloop en artisanale bereiding.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-3 text-orange-600">Verse Noedels</h3>
                <p className="text-muted-foreground">
                  Handgemaakte ramen noedels volgens traditioneel Japans recept. 
                  Perfect voor de juiste textuur en smaakopname.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-3 text-orange-600">Shoyu Tare</h3>
                <p className="text-muted-foreground">
                  Authentieke shoyu saus geïmporteerd uit Japan, aangevuld met 
                  lokale ingrediënten voor onze eigen twist.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Klaar voor een authentieke ramen ervaring?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Meld je aan voor de volgende ramen avond en ontdek waarom onze gasten blijven terugkomen
          </p>
          <Button 
            onClick={() => window.location.href = "/#ramen"}
            size="lg"
            className="brewery-gradient text-white px-12 py-4 text-xl hover:scale-105 transition-all duration-300"
          >
            Naar Aanmelding
          </Button>
        </div>
      </div>
    </div>
  );
}