import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Award } from "lucide-react";

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

      {/* Other Products Section - Right Aligned */}
      <section className="py-20 bg-gradient-to-l from-purple-50/30 to-transparent dark:from-purple-950/10 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Decorative Space */}
            <div className="hidden lg:block">
              <div className="w-full h-96 bg-gradient-to-br from-purple-100/40 to-pink-200/30 rounded-3xl flex items-center justify-center">
                <div className="text-center text-purple-300">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-16 h-16 text-purple-500/40" />
                  </div>
                  <p className="text-lg font-display">Lokale Specialiteiten</p>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl font-bold mb-6">
                  <span className="brewery-text-gradient">Onze Andere Producten</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Naast onze kombucha en workshops bieden we ook andere lokale 
                  specialiteiten aan. Van seizoensgebonden jam tot verse limonade.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors group cursor-pointer"
                      onClick={() => window.location.href = "/webshop"}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🍓</span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">Seizoensjam</h3>
                    <p className="text-muted-foreground text-sm">
                      Verse jam van lokale vruchten
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors group cursor-pointer ml-4"
                      onClick={() => window.location.href = "/webshop"}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🥐</span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">Soms Gebak</h3>
                    <p className="text-muted-foreground text-sm">
                      Vers gebak wanneer beschikbaar
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors group cursor-pointer"
                      onClick={() => window.location.href = "/webshop"}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🍋</span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">Limonade</h3>
                    <p className="text-muted-foreground text-sm">
                      Verse biologische limonade
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors group cursor-pointer ml-4"
                      onClick={() => window.location.href = "/webshop"}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">Andere Specialiteiten</h3>
                    <p className="text-muted-foreground text-sm">
                      Wisselende lokale producten
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                <button 
                  className="brewery-gradient text-white px-12 py-4 text-xl rounded-full hover:scale-105 transition-all duration-300 font-semibold"
                  onClick={() => window.location.href = "/webshop"}
                >
                  Bekijk Alle Producten
                  <span className="ml-3">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}