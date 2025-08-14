import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Leaf, Award, Heart, ArrowRight } from "lucide-react";

export function AdditionalSections() {
  return (
    <>
      {/* Sustainability Section - Left Aligned */}
      <section className="py-20 bg-gradient-to-r from-green-50/40 to-transparent dark:from-green-950/20 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl font-bold mb-6">
                  <span className="brewery-text-gradient">Duurzaamheid</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Onze kombucha wordt gebrouwen met respect voor de natuur en lokale gemeenschap. 
                  Van biologische ingrediënten tot herbruikbare verpakkingen.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-2">Biologische Ingrediënten</h3>
                      <p className="text-muted-foreground">
                        Alleen gecertificeerde biologische thee en kruiden uit lokale bronnen
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-100 hover:border-green-300 transition-colors ml-8">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-2">Zero Waste</h3>
                      <p className="text-muted-foreground">
                        Herbruikbare flessen en compostering van alle organische resten
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right - Decorative Space */}
            <div className="hidden lg:block">
              <div className="w-full h-96 bg-gradient-to-bl from-green-100/40 to-emerald-200/30 rounded-3xl flex items-center justify-center">
                <div className="text-center text-green-300">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Leaf className="w-16 h-16 text-green-500/40" />
                  </div>
                  <p className="text-lg font-display">Duurzame Brouwerij</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section - Right Aligned */}
      <section className="py-20 bg-gradient-to-l from-blue-50/30 to-transparent dark:from-blue-950/10 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Decorative Space */}
            <div className="hidden lg:block">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100/40 to-indigo-200/30 rounded-3xl flex items-center justify-center">
                <div className="text-center text-blue-300">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-blue-500/40" />
                  </div>
                  <p className="text-lg font-display">Groningen Gemeenschap</p>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl font-bold mb-6">
                  <span className="brewery-text-gradient">Onze Gemeenschap</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Meer dan alleen kombucha - we bouwen aan een gezonde gemeenschap 
                  in het hart van Groningen met lokale partnerships en events.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-2">Lokale Leveranciers</h3>
                      <p className="text-muted-foreground">
                        Samenwerking met Groningse boeren en leveranciers voor verse ingrediënten
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors ml-8">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-2">Maandelijkse Events</h3>
                      <p className="text-muted-foreground">
                        Proefsessies, workshops en gemeenschapsevenementen elke maand
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                <Button 
                  size="lg"
                  className="brewery-gradient text-white px-12 py-4 text-xl rounded-full hover:scale-105 transition-all duration-300"
                  onClick={() => window.location.href = "/events"}
                >
                  Bekijk Evenementen
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}