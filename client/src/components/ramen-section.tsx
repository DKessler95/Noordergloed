import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, ChefHat, Users, Phone, Mail, User, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function RamenSection() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    preferredDate: "",
    servings: 1,
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/orders/ramen", data);
    },
    onSuccess: () => {
      toast({
        title: "Ramen Workshop Aanmelding",
        description: "Je aanmelding is succesvol verstuurd! We nemen binnen 24 uur contact met je op.",
      });
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        preferredDate: "",
        servings: 1,
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workshop-orders"] });
    },
    onError: (error) => {
      toast({
        title: "Fout bij aanmelden",
        description: "Er is iets misgegaan. Probeer het opnieuw of neem contact met ons op.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.preferredDate) {
      toast({
        title: "Velden niet ingevuld",
        description: "Vul alle verplichte velden in.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

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

          {/* Right - Booking Form */}
          <Card className="shadow-2xl border-2 border-orange-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-display brewery-text-gradient">
                Meld je aan voor Ramen Workshop
              </CardTitle>
              <p className="text-muted-foreground">
                Reserveer je plek voor de volgende workshop
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Naam *
                    </Label>
                    <Input
                      id="name"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Je volledige naam"
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="je.email@example.com"
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Telefoon
                  </Label>
                  <Input
                    id="phone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="06 12 34 56 78"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Gewenste Datum *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                      className="border-orange-200 focus:border-orange-400"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Aantal Personen
                    </Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      max="4"
                      value={formData.servings}
                      onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Opmerkingen</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Allergieën, dieetwensen of andere opmerkingen..."
                    className="w-full min-h-[80px] px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:border-orange-400 resize-none"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full brewery-gradient text-white text-lg py-3 hover:scale-105 transition-all duration-300"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Aanmelden..." : "Aanmelden voor Workshop"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Verplichte velden. We nemen binnen 24 uur contact met je op voor bevestiging.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}