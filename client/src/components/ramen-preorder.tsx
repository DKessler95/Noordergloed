import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, Users, CheckCircle, Info, MapPin, ExternalLink } from "lucide-react";
import { RamenCalendar } from "./ramen-calendar";
import ramenImage from "@assets/IMG_20250527_233628.jpg";

const ramenOrderSchema = z.object({
  customerName: z.string().min(1, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig email adres"),
  customerPhone: z.string().min(1, "Telefoon is verplicht"),
  preferredDate: z.string().min(1, "Selecteer een datum"),
  notes: z.string().optional(),
});

type RamenOrderForm = z.infer<typeof ramenOrderSchema>;

export function RamenPreorder() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const form = useForm<RamenOrderForm>({
    resolver: zodResolver(ramenOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      preferredDate: "",
      notes: "",
    },
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    form.setValue("preferredDate", date.toISOString().split('T')[0]);
  };

  const orderMutation = useMutation({
    mutationFn: async (data: RamenOrderForm) => {
      return apiRequest("POST", "/api/orders/ramen", data);
    },
    onSuccess: () => {
      toast({
        title: "Ramen bestelling geplaatst!",
        description: "We nemen contact met je op voor bevestiging.",
      });
      form.reset();
      setSelectedDate("");
    },
    onError: (error: any) => {
      toast({
        title: "Er ging iets mis",
        description: error.message || "Probeer het later opnieuw.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RamenOrderForm) => {
    orderMutation.mutate(data);
  };

  // Generate next 30 days, only Fridays, at least 4 days from now
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 4);

    for (let i = 0; i < 60; i++) {
      const date = new Date(minDate);
      date.setDate(minDate.getDate() + i);
      
      if (date.getDay() === 5) { // Friday
        dates.push(date);
      }
      
      if (dates.length >= 8) break; // Show next 8 Fridays
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  return (
    <section id="ramen" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ramen Pre-order
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Chicken Shoyu Ramen met krokante kip - per persoon boeken. Pas als er 6 mensen hebben 
            geboekt voor dezelfde vrijdag wordt de ramen-avond bevestigd!
          </p>
        </div>

        {/* Product showcase */}
        <div className="mb-12">
          <Card className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img 
                    src={ramenImage} 
                    alt="Chicken Shoyu Ramen met krokante kip" 
                    className="w-full h-80 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Chicken Shoyu Ramen
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Verse zelfgemaakte noedels
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Krokante kip met perfecte textuur
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Rijke shoyu bouillon (24+ uur getrokken)
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Verse toppings: ajitsuke tamago, nori, lente-ui
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Lokale ingrediënten uit Groningen
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-display font-bold text-purple-600 dark:text-purple-400">
                        €12,50
                      </span>
                      <span className="text-gray-500 ml-2">per persoon</span>
                    </div>
                    <Button
                      variant="outline"
                      className="text-purple-600 border-purple-600 hover:bg-purple-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Meer details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <RamenCalendar 
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                />
                  
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Minimaal 4 dagen van tevoren boeken. Ophalen elke vrijdag tussen 17:00-19:00.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          <strong>Hoe het werkt:</strong> Boek je plekje per persoon. Zodra er 6 mensen hebben geboekt voor dezelfde datum wordt de ramen-avond bevestigd!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Order Details
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                      Jouw Boeking
                    </h4>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Chicken Shoyu Ramen</span>
                        <span className="font-semibold">1 persoon</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Prijs per persoon</span>
                        <span className="font-semibold">€12,50</span>
                      </div>
                      {selectedDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Gekozen datum</span>
                          <span className="font-semibold">
                            {new Date(selectedDate).toLocaleDateString('nl-NL', { 
                              weekday: 'long',
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">Jouw deel</span>
                        <span className="font-display text-2xl font-bold text-purple-600 dark:text-purple-400">
                          €12,50
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Betaling volgt na bevestiging groep
                      </p>
                    </div>
                  </div>

                  {/* Location & pickup info */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Ophaallocatie
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Adres:</strong> Star Numanstraat, 9717JE Groningen</p>
                      <p><strong>Tijd:</strong> Vrijdag 17:00-19:00</p>
                      <p><strong>Parkeren:</strong> Gratis op straat</p>
                    </div>
                    
                    <div className="mt-4 h-32 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto w-6 h-6 text-gray-500 mb-1" />
                        <p className="text-sm text-gray-500">Google Maps wordt hier geladen</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Naam</Label>
                      <Input
                        id="customerName"
                        {...form.register("customerName")}
                        placeholder="Je volledige naam"
                        className="mt-1"
                      />
                      {form.formState.errors.customerName && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.customerName.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...form.register("customerEmail")}
                        placeholder="je@email.nl"
                        className="mt-1"
                      />
                      {form.formState.errors.customerEmail && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.customerEmail.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="customerPhone">Telefoon</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        {...form.register("customerPhone")}
                        placeholder="06-12345678"
                        className="mt-1"
                      />
                      {form.formState.errors.customerPhone && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.customerPhone.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Opmerkingen (optioneel)</Label>
                      <Textarea
                        id="notes"
                        {...form.register("notes")}
                        placeholder="Allergieën, speciale wensen..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={orderMutation.isPending || !selectedDate}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {orderMutation.isPending ? "Bezig..." : "Boek Mijn Plek - €12,50"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
