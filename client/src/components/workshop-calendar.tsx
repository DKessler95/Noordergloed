import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, Users, MapPin, Star, CheckCircle2, Phone, Mail, User } from "lucide-react";
import type { WorkshopOrder } from "@shared/schema";

const workshopRegistrationSchema = z.object({
  customerName: z.string().min(1, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig email adres"),
  customerPhone: z.string().min(1, "Telefoon is verplicht"),
  preferredDate: z.string().min(1, "Datum is verplicht"),
  notes: z.string().optional(),
});

type WorkshopRegistrationForm = z.infer<typeof workshopRegistrationSchema>;

// Generate next 8 Fridays
function getNextFridays(count: number = 8): Date[] {
  const fridays: Date[] = [];
  const today = new Date();
  let currentDate = new Date(today);
  
  // Find next Friday
  while (currentDate.getDay() !== 5) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Generate fridays
  for (let i = 0; i < count; i++) {
    fridays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return fridays;
}

interface CalendarDayProps {
  date: Date;
  registrationCount: number;
  onSelect: (date: Date) => void;
  isSelected: boolean;
}

function CalendarDay({ date, registrationCount, onSelect, isSelected }: CalendarDayProps) {
  const minCapacity = 6;
  const maxCapacity = 12;
  const isConfirmed = registrationCount >= minCapacity;
  const isFull = registrationCount >= maxCapacity;
  const spotsLeft = maxCapacity - registrationCount;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-orange-500 border-orange-300' : 'border-orange-200'
      } ${isFull ? 'opacity-60' : ''}`}
      onClick={() => !isFull && onSelect(date)}
    >
      <CardContent className="p-4 text-center">
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {formatDate(date)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          17:00 - 19:00
        </div>
        
        <div className="space-y-1">
          <Badge 
            variant={isFull ? "destructive" : isConfirmed ? "default" : "secondary"}
            className="text-xs"
          >
            {isFull ? "Volgeboekt" : isConfirmed ? "Bevestigd" : `${registrationCount}/${minCapacity}`}
          </Badge>
          
          {!isFull && (
            <div className="text-xs text-gray-500">
              {spotsLeft} plekken over
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface RegistrationModalProps {
  selectedDate: Date | null;
  isOpen: boolean;
  onClose: () => void;
}

function RegistrationModal({ selectedDate, isOpen, onClose }: RegistrationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WorkshopRegistrationForm>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      preferredDate: selectedDate?.toISOString().split('T')[0] || "",
      notes: "",
    },
  });

  // Update form when selectedDate changes
  useState(() => {
    if (selectedDate) {
      form.setValue("preferredDate", selectedDate.toISOString().split('T')[0]);
    }
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: WorkshopRegistrationForm) => {
      return await apiRequest("POST", "/api/orders/ramen", {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        preferredDate: data.preferredDate,
        servings: 1,
        notes: data.notes || ""
      });
    },
    onSuccess: () => {
      toast({
        title: "Aanmelding succesvol!",
        description: "Je bent aangemeld voor de ramen workshop. Je ontvangt een bevestigingsmail.",
      });
      form.reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/workshop-orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Er ging iets mis",
        description: error.message || "Probeer het later opnieuw.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: WorkshopRegistrationForm) => {
    registrationMutation.mutate(data);
  };

  if (!isOpen || !selectedDate) return null;

  const formattedDate = selectedDate.toLocaleDateString('nl-NL', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl brewery-text-gradient">
            Aanmelden voor Ramen Workshop
          </CardTitle>
          <p className="text-muted-foreground">
            {formattedDate} • 17:00 - 19:00
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="flex items-center text-sm font-medium mb-1">
                <User className="w-4 h-4 mr-2" />
                Naam *
              </label>
              <Input
                id="customerName"
                {...form.register("customerName")}
                placeholder="Je volledige naam"
                className="border-orange-200 focus:border-orange-400"
              />
              {form.formState.errors.customerName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.customerName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="customerEmail" className="flex items-center text-sm font-medium mb-1">
                <Mail className="w-4 h-4 mr-2" />
                Email *
              </label>
              <Input
                id="customerEmail"
                type="email"
                {...form.register("customerEmail")}
                placeholder="je@email.nl"
                className="border-orange-200 focus:border-orange-400"
              />
              {form.formState.errors.customerEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.customerEmail.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="customerPhone" className="flex items-center text-sm font-medium mb-1">
                <Phone className="w-4 h-4 mr-2" />
                Telefoonnummer *
              </label>
              <Input
                id="customerPhone"
                type="tel"
                {...form.register("customerPhone")}
                placeholder="06-12345678"
                className="border-orange-200 focus:border-orange-400"
              />
              {form.formState.errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.customerPhone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Opmerkingen (optioneel)
              </label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                placeholder="Allergieën, dieetwensen of andere opmerkingen..."
                rows={3}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Workshop Details:</h4>
              <ul className="text-xs space-y-1">
                <li>• €12,50 per persoon</li>
                <li>• Minimaal 6 personen voor bevestiging</li>
                <li>• Inclusief alle ingrediënten en begeleiding</li>
                <li>• Locatie wordt nog bekend gemaakt</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={registrationMutation.isPending}
                className="flex-1 brewery-gradient text-white"
              >
                {registrationMutation.isPending ? "Aanmelden..." : "Aanmelden"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function WorkshopCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get workshop orders to calculate capacity
  const { data: workshopOrders = [] } = useQuery<WorkshopOrder[]>({
    queryKey: ["/api/workshop-orders"],
    retry: false,
  });

  const fridays = getNextFridays(8);

  const getRegistrationCount = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    return workshopOrders.filter(order => {
      const orderDate = new Date(order.preferredDate).toISOString().split('T')[0];
      return orderDate === dateStr;
    }).length;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <Card className="shadow-2xl border-2 border-orange-200">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-display brewery-text-gradient">
          Ramen Agenda
        </CardTitle>
        <p className="text-muted-foreground">
          Kies een vrijdag voor je Ramen
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {fridays.map((friday, index) => (
            <CalendarDay
              key={index}
              date={friday}
              registrationCount={getRegistrationCount(friday)}
              onSelect={handleDateSelect}
              isSelected={selectedDate?.getTime() === friday.getTime()}
            />
          ))}
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">0/6</Badge>
            <span>Wachtend op minimum aantal deelnemers</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">Bevestigd</Badge>
            <span>Workshop gaat door</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">Volgeboekt</Badge>
            <span>Geen plekken meer beschikbaar</span>
          </div>
        </div>
      </CardContent>

      <RegistrationModal
        selectedDate={selectedDate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
}