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

export function RamenPreorderFixed() {
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
      setSelectedDate(undefined);
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

  return (
    <section id="ramen" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ramen Voorbestelling
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Authentieke Japanse ramen bereid met verse lokale ingrediënten. 
            Alleen op vrijdag, maximaal 6 personen per avond.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Alleen Vrijdagen
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Verse ramen elke vrijdag tussen 17:00-19:00. Minimaal 4 dagen van tevoren boeken.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Maximaal 6 Personen
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intieme setting voor de beste kwaliteit. Elk kom wordt met zorg bereid.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Lokale Ingrediënten
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Verse ingrediënten uit Groningen, gecombineerd met authentieke Japanse technieken.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Card className="bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={ramenImage}
                    alt="Chicken Shoyu Ramen"
                    className="w-full h-full object-cover"
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
                    <a 
                      href="/ramen-details" 
                      className="inline-flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Meer details
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meer Details Sectie */}
        <div className="max-w-4xl mx-auto text-center my-8">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              🍜 Meer weten over ons ramen proces?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ontdek hoe we bereiden, wat je krijgt en hoe het ophalen werkt.
            </p>
            <a 
              href="/ramen-details" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Bekijk alle details
            </a>
          </div>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <RamenCalendar 
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                />
              </div>

              <div>
                <h3 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Boek je plek
                </h3>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="customerName">Naam</Label>
                    <Input
                      id="customerName"
                      {...form.register("customerName")}
                      placeholder="Je volledige naam"
                      className="mt-1"
                    />
                    {form.formState.errors.customerName && (
                      <p className="text-red-500 text-sm mt-1">
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
                      placeholder="je@email.com"
                      className="mt-1"
                    />
                    {form.formState.errors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.customerEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Telefoon</Label>
                    <Input
                      id="customerPhone"
                      {...form.register("customerPhone")}
                      placeholder="06-12345678"
                      className="mt-1"
                    />
                    {form.formState.errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.customerPhone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Opmerkingen (optioneel)</Label>
                    <Textarea
                      id="notes"
                      {...form.register("notes")}
                      placeholder="Allergieën, dieetwensen, etc."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {form.formState.errors.preferredDate && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.preferredDate.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
                    disabled={orderMutation.isPending || !selectedDate}
                  >
                    {orderMutation.isPending ? "Bezig..." : "Boek Mijn Plek - €12,50"}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}