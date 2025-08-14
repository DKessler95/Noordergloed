import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ChefHat, Users, Star } from "lucide-react";
import { WorkshopCalendar } from "@/components/workshop-calendar";

export function RamenSection() {

  return (
    <section className="py-20 bg-gradient-to-r from-amber-50/50 to-orange-100/30 dark:from-amber-950/20 dark:to-orange-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">
                <span className="brewery-text-gradient">Ramen Workshop Agenda</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Verse ramen elke vrijdag tussen 17:00-19:00. Minimaal 4 dagen van tevoren boeken.
              </p>
            </div>

            {/* Workshop Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-orange-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 brewery-gradient rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Alleen Vrijdagen</h4>
                    <p className="text-sm text-muted-foreground">17:00 - 19:00</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 brewery-gradient rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Minimaal 6 Personen</h4>
                    <p className="text-sm text-muted-foreground">Intieme setting voor beste kwaliteit</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 brewery-gradient rounded-full flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Lokale Ingrediënten</h4>
                    <p className="text-sm text-muted-foreground">Verse ingrediënten uit Groningen</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 brewery-gradient rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Authentieke Technieken</h4>
                    <p className="text-sm text-muted-foreground">Japanse methoden</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chicken Shoyu Ramen Product Card */}
            <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-2xl font-bold text-orange-800">
                    Chicken Shoyu Ramen
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">€12,50</div>
                    <div className="text-sm text-muted-foreground">per persoon</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-orange-500 mr-2" />
                    Verse zelfgemaakte noedels
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-orange-500 mr-2" />
                    Krokante kip met perfecte textuur
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-orange-500 mr-2" />
                    Rijke shoyu bouillon (24+ uur getrokken)
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-orange-500 mr-2" />
                    Verse toppings: ajitsuke tamago, nori, lente-ui en meer
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-orange-500 mr-2" />
                    Lokale ingrediënten uit Groningen
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                  onClick={() => window.location.href = "/workshop-details"}
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Bekijk Bereidingsproces
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right - Workshop Calendar/Booking System */}
          <WorkshopCalendar />
        </div>
      </div>
    </section>
  );
}