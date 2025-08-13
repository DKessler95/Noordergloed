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
import { Calendar, Clock, Users, MapPin, Star, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Product } from "@shared/schema";

const workshopRegistrationSchema = z.object({
  customerName: z.string().min(1, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig email adres"),
  customerPhone: z.string().min(1, "Telefoon is verplicht"),
  notes: z.string().optional(),
});

type WorkshopRegistrationForm = z.infer<typeof workshopRegistrationSchema>;

interface WorkshopCardProps {
  workshop: Product;
  onRegister: (workshop: Product) => void;
}

function WorkshopCard({ workshop, onRegister }: WorkshopCardProps) {
  const maxCapacity = 12;
  const registeredCount = maxCapacity - workshop.stock;
  const isFullyBooked = workshop.stock === 0;
  const spotsLeft = workshop.stock;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={workshop.imageUrl || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"}
          alt={workshop.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={isFullyBooked ? "destructive" : "secondary"} className="bg-white/90 text-gray-800">
            {isFullyBooked ? "Volgeboekt" : `${spotsLeft} plekken over`}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          {workshop.name}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{registeredCount}/{maxCapacity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Zaterdagen</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>3 uur</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {workshop.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-green-600">
            €{parseFloat(workshop.price.toString()).toFixed(2)}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">(5.0)</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Alle materialen inbegrepen</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Eigen SCOBY mee naar huis</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Receptenboek inbegrepen</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>Star Numanstraat, Groningen</span>
          </div>
        </div>
        
        <Button
          onClick={() => onRegister(workshop)}
          disabled={isFullyBooked}
          className={`w-full ${
            isFullyBooked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          } text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300`}
        >
          {isFullyBooked ? "Volgeboekt" : "Aanmelden"}
        </Button>
      </CardContent>
    </Card>
  );
}

interface RegistrationModalProps {
  workshop: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function RegistrationModal({ workshop, isOpen, onClose }: RegistrationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WorkshopRegistrationForm>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: WorkshopRegistrationForm) => {
      // Register for workshop by creating an order
      const orderData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        productId: workshop!.id,
        quantity: 1,
        totalAmount: parseFloat(workshop!.price.toString()),
        notes: data.notes || "",
        status: "confirmed",
        deliveryMethod: "pickup"
      };
      
      // Create order and reduce stock
      await apiRequest("POST", "/api/orders", orderData);
      
      // Update product stock
      await apiRequest("PATCH", `/api/products/${workshop!.id}`, {
        stock: Math.max(0, workshop!.stock - 1)
      });
    },
    onSuccess: () => {
      toast({
        title: "Aanmelding succesvol!",
        description: "Je bent aangemeld voor de workshop. Je ontvangt een bevestigingsmail.",
      });
      form.reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
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

  if (!isOpen || !workshop) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Aanmelden voor {workshop.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                Naam *
              </label>
              <Input
                id="customerName"
                {...form.register("customerName")}
                placeholder="Je volledige naam"
              />
              {form.formState.errors.customerName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.customerName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <Input
                id="customerEmail"
                type="email"
                {...form.register("customerEmail")}
                placeholder="je@email.nl"
              />
              {form.formState.errors.customerEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.customerEmail.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium mb-1">
                Telefoonnummer *
              </label>
              <Input
                id="customerPhone"
                type="tel"
                {...form.register("customerPhone")}
                placeholder="06-12345678"
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
                placeholder="Eventuele vragen of opmerkingen..."
                rows={3}
              />
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
                className="flex-1 bg-green-600 hover:bg-green-700"
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

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const workshops = products.filter(product => product.category === "workshop");

  const handleRegister = (workshop: Product) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorkshop(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Kombucha Workshops
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Leer de kunst van kombucha brouwen in onze hands-on workshops. 
            Perfect voor beginners en ervaren brouwers die hun kennis willen uitbreiden.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onRegister={handleRegister}
            />
          ))}
        </div>

        {workshops.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
              Geen workshops beschikbaar
            </h2>
            <p className="text-gray-500 dark:text-gray-500">
              Er zijn momenteel geen workshops gepland. Kom later terug voor nieuwe data!
            </p>
          </div>
        )}
      </main>

      <RegistrationModal
        workshop={selectedWorkshop}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <Footer />
    </div>
  );
}