import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Clock, Award } from "lucide-react";

export function WorkshopsSection() {
  return (
    <section className="py-20 bg-gradient-to-l from-orange-50/30 to-transparent dark:from-orange-950/10 dark:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Empty space for balance */}
          <div className="hidden lg:block">
            <div className="w-full h-96 bg-gradient-to-br from-orange-100/40 to-amber-200/30 rounded-3xl flex items-center justify-center">
              <div className="text-center text-orange-300">
                <div className="w-32 h-32 brewery-gradient rounded-full opacity-20 mx-auto mb-4"></div>
                <p className="text-lg font-display">Kombucha Brouwerij</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">
                <span className="brewery-text-gradient">Workshops & Starterspakketen</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Doe mee met onze interactieve workshops. Leer de kunst van fermenteren en andere brouwtechnieken.
                Van beginner tot expert - ontdek de geheimen van fermentatie.
              </p>
            </div>

            {/* Workshop Features - Asymmetric Layout */}
            <div className="space-y-6">
              <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 brewery-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Kleine Groepen</h3>
                    <p className="text-muted-foreground">
                      Maximaal 12 deelnemers per workshop voor persoonlijke begeleiding
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors ml-8">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 brewery-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Leer alles over brouwen & fermenteren</h3>
                    <p className="text-muted-foreground">
                       Het gehele proces van start tot finish.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="w-12 h-12 brewery-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Uitgebreide workshop</h3>
                    <p className="text-muted-foreground">
                      Theorie, benodigheden, praktijk en een proeverij als afsluiting. Na de workshop ga je naar huis met je eigen brouwsel om te laten fermenteren.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button 
                size="lg"
                className="brewery-gradient text-white px-12 py-4 text-xl rounded-full hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = "/workshops"}
              >
                Ontdek nu onze workshops
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}