import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Users, ChefHat, User, Mail, Phone, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WorkshopOrder } from "@shared/schema";

// Friday Calendar Component
function FridayCalendar({ selectedDate, onDateSelect }: { selectedDate: string, onDateSelect: (date: string) => void }) {
  const [currentOffset, setCurrentOffset] = useState(0);
  const { data: workshopOrders = [] } = useQuery<WorkshopOrder[]>({
    queryKey: ["/api/workshop-orders"],
    retry: false,
  });

  // Generate next 8 Fridays starting from an offset
  const getNextFridays = (count: number = 8, offsetWeeks: number = 0): Date[] => {
    const fridays: Date[] = [];
    const today = new Date();
    let currentDate = new Date(today);
    
    // Find next Friday
    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Apply offset
    currentDate.setDate(currentDate.getDate() + (offsetWeeks * 7));
    
    // Generate fridays
    for (let i = 0; i < count; i++) {
      fridays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return fridays;
  };

  const getRegistrationCount = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    return workshopOrders.filter(order => {
      const orderDate = new Date(order.preferredDate).toISOString().split('T')[0];
      return orderDate === dateStr;
    }).length;
  };

  const fridays = getNextFridays(8, currentOffset);
  const maxOffset = 8; // Limit to 16 weeks ahead (8 * 2 weeks)

  return (
    <div className="space-y-4">
      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCurrentOffset(Math.max(0, currentOffset - 4))}
          disabled={currentOffset === 0}
          className="text-orange-600 border-orange-300 hover:bg-orange-50"
        >
          ← Vorige
        </Button>
        <span className="text-sm text-gray-500 font-medium">
          {currentOffset === 0 ? 'Komende weken' : `${currentOffset + 1}-${currentOffset + 8} weken vooruit`}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCurrentOffset(Math.min(maxOffset, currentOffset + 4))}
          disabled={currentOffset >= maxOffset}
          className="text-orange-600 border-orange-300 hover:bg-orange-50"
        >
          Volgende →
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-4 gap-2">
        {fridays.map((friday, index) => {
          const dateStr = friday.toISOString().split('T')[0];
          const registrationCount = getRegistrationCount(friday);
          const minCapacity = 6;
          const maxCapacity = 12;
          const isSelected = selectedDate === dateStr;
          const isConfirmed = registrationCount >= minCapacity;
          const isFull = registrationCount >= maxCapacity;
          
          let dotColor = 'bg-gray-400'; // Default
          if (isFull) dotColor = 'bg-red-500'; // Full
          else if (isConfirmed) dotColor = 'bg-blue-500'; // Confirmed
          else if (registrationCount > 0) dotColor = 'bg-green-500'; // Some registrations

          return (
            <button
              key={index}
              type="button"
              disabled={isFull}
              onClick={() => !isFull && onDateSelect(dateStr)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'
              } ${isFull ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50'}`}
            >
              <div className="text-center">
                <div className="text-sm font-semibold">
                  {friday.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                </div>
                <div className="text-xs text-gray-500 mb-2">17:00-19:00</div>
                <div className={`w-3 h-3 rounded-full mx-auto ${dotColor}`} />
                <div className="text-xs mt-1">
                  {isFull ? 'Vol' : isConfirmed ? 'Gaat door' : `${registrationCount}/${minCapacity}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RamenSection() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRamenType, setSelectedRamenType] = useState<'chicken' | 'tonkotsu'>('chicken');
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    servings: 1,
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/workshop-orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Aanmelding succesvol!",
        description: "Je bent aangemeld voor de ramen avond. We nemen binnen 24 uur contact met je op.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workshop-orders"] });
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        servings: 1,
        notes: ""
      });
      setSelectedDate("");
    },
    onError: (error: any) => {
      toast({
        title: "Aanmelden mislukt",
        description: error.message || "Er ging iets mis bij het aanmelden",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Selecteer een datum",
        description: "Kies een vrijdagavond voor de ramen workshop",
        variant: "destructive",
      });
      return;
    }

    const ramenPrice = selectedRamenType === 'chicken' ? 12.50 : 15.00;
    const totalAmount = ramenPrice * formData.servings;

    mutation.mutate({
      ...formData,
      preferredDate: selectedDate,
      totalAmount: `€${totalAmount.toFixed(2)}`,
      status: "pending",
      notes: `${formData.notes}\n\nRamen type: ${selectedRamenType === 'chicken' ? 'Chicken Shoyu (€12,50)' : 'Tonkotsu Shoyu (€15,00)'}`
    });
  };

  return (
    <section id="ramen" className="py-20 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-500 text-white text-lg px-4 py-2">
            Vrijdagavond Ramen
          </Badge>
          <h2 className="font-display text-5xl font-bold mb-6">
            <span className="brewery-text-gradient">Authentieke Ramen Avonden</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Elke vrijdagavond serveren we verse, handgemaakte ramen in een gezellige sfeer. 
            Kies tussen onze klassieke Chicken Shoyu of premium Tonkotsu Shoyu ramen.
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              17:00 - 19:00
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              6-12 personen
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Alleen vrijdag
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Ramen Types & Info */}
          <div className="space-y-8">
            {/* Calendar Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Kies je Ramen Avond
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FridayCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              </CardContent>
            </Card>

            {/* Ramen Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Kies je Ramen Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Chicken Shoyu Option */}
                  <div 
                    onClick={() => setSelectedRamenType('chicken')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRamenType === 'chicken' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src="/images/chicken-shoyu-ramen.jpg"
                            alt="Chicken Shoyu Ramen"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                              }
                            }}
                          />
                          <div className="hidden w-full h-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                            <ChefHat className="w-6 h-6 text-orange-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Chicken Shoyu Ramen</h3>
                          <p className="text-sm text-muted-foreground">Traditionele ramen met kip</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">€12,50</div>
                        <div className="text-xs text-muted-foreground">per persoon</div>
                      </div>
                    </div>
                  </div>

                  {/* Tonkotsu Shoyu Option */}
                  <div 
                    onClick={() => setSelectedRamenType('tonkotsu')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRamenType === 'tonkotsu' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-200 to-pink-200 flex items-center justify-center">
                          <ChefHat className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Tonkotsu Shoyu Ramen</h3>
                          <p className="text-sm text-muted-foreground">Premium ramen met varkensbouillon</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">€15,00</div>
                        <div className="text-xs text-muted-foreground">per persoon</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* More Info Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    onClick={() => window.open('/ramen/chicken-shoyu', '_blank')}
                  >
                    Chicken Shoyu Info
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => window.open('/ramen/tonkotsu-shoyu', '_blank')}
                  >
                    Tonkotsu Shoyu Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Wat te verwachten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Verse zelfgemaakte noedels</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>24-36 uur getrokken bouillon</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Verse toppings en lokale ingrediënten</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span>Gezellige sfeer met andere ramen liefhebbers</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Booking Form */}
          <Card className="shadow-2xl border-2 border-orange-200">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-display brewery-text-gradient">
                Meld je aan voor Ramen Avond
              </CardTitle>
              <p className="text-muted-foreground">
                Reserveer je plek voor de volgende ramen avond
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
                    Telefoonnummer *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+31 6 12345678"
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Aantal personen (max 4 per aanmelding)</Label>
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

                {/* Total Price Display */}
                {selectedDate && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Totaal ({formData.servings}x {selectedRamenType === 'chicken' ? 'Chicken Shoyu' : 'Tonkotsu Shoyu'}):</span>
                      <span className="font-bold text-orange-600">
                        €{((selectedRamenType === 'chicken' ? 12.50 : 15.00) * formData.servings).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full brewery-gradient text-white text-lg py-3 hover:scale-105 transition-all duration-300"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Aanmelden..." : "Aanmelden voor Ramen Avond"}
                </Button>

                <p className="text-xs text-muted-foreground text-center mb-0">
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