import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Clock, Award } from "lucide-react";

export function WorkshopsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50/30 to-amber-50/30 dark:from-orange-950/10 dark:to-amber-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-6">
            <span className="brewery-text-gradient">Kombucha Workshops</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leer de kunst van kombucha brouwen in onze interactieve workshops. 
            Van beginner tot expert - ontdek de geheimen van fermentatie.
          </p>
        </div>

        {/* Workshop Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center border-2 border-orange-100 hover:border-orange-300 transition-colors">
            <CardContent className="p-8">
              <div className="w-16 h-16 brewery-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Kleine Groepen</h3>
              <p className="text-muted-foreground">
                Maximaal 12 deelnemers per workshop voor persoonlijke begeleiding
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-orange-100 hover:border-orange-300 transition-colors">
            <CardContent className="p-8">
              <div className="w-16 h-16 brewery-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">3 Uur Ervaring</h3>
              <p className="text-muted-foreground">
                Uitgebreide workshop met theorie, praktijk en proeverij
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-orange-100 hover:border-orange-300 transition-colors">
            <CardContent className="p-8">
              <div className="w-16 h-16 brewery-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Scoby Mee</h3>
              <p className="text-muted-foreground">
                Neem je eigen kombucha scoby mee naar huis om verder te brouwen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
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
    </section>
  );
}