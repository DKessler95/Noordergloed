import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { Calendar, Clock, Users, CheckCircle, Info } from "lucide-react";

const ramenOrderSchema = z.object({
  customerName: z.string().min(1, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig email adres"),
  customerPhone: z.string().min(1, "Telefoon is verplicht"),
  preferredDate: z.string().min(1, "Selecteer een datum"),
  notes: z.string().optional(),
});

type RamenOrderForm = z.infer<typeof ramenOrderSchema>;

export function RamenPreorder() {
  const [selectedDate, setSelectedDate] = useState<string>("");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ramen Pre-order
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exclusieve Chicken Shoyu Ramen voor 6 personen. Bestel minimaal 4 dagen van tevoren 
            en haal elke vrijdag op in Groningen.
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Kies je datum
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Beschikbare vrijdagen
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {availableDates.map((date) => {
                      const dateString = date.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateString;
                      
                      return (
                        <button
                          key={dateString}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateString);
                            form.setValue("preferredDate", dateString);
                          }}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                          }`}
                        >
                          {date.toLocaleDateString('nl-NL', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Minimaal 4 dagen van tevoren bestellen. Ophalen elke vrijdag tussen 17:00-19:00.
                      </p>
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
                      Chicken Shoyu Ramen
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-center">
                        <Users className="w-4 h-4 text-green-500 mr-2" />
                        Voor 6 personen
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Verse lokale ingrediënten
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Zelfgemaakte noedels
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Inclusief toppings
                      </li>
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">Totaal</span>
                        <span className="font-display text-2xl font-bold text-purple-600 dark:text-purple-400">
                          €45,00
                        </span>
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
                      {orderMutation.isPending ? "Bezig..." : "Ramen Bestellen - €45,00"}
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
