export function WelcomeSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-5xl font-bold mb-6">
            <span className="brewery-text-gradient">Welkom bij Brouwerij Noordergloed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            In het hart van Groningen brouwen wij met passie en toewijding de meest unieke kombucha. 
            Van traditionele recepten tot vernieuwende smaken - elke fles vertelt ons verhaal van 
            kwaliteit, ambacht en liefde voor fermentatie. Ontdek de smaak van authentieke kombucha, 
            gemaakt met lokale ingrediënten en jarenlange ervaring.
          </p>
        </div>
      </div>
    </section>
  );
}