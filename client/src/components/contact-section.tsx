import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock, Send, Instagram } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "Voornaam is verplicht"),
  lastName: z.string().min(1, "Achternaam is verplicht"),
  email: z.string().email("Ongeldig email adres"),
  subject: z.string().min(1, "Selecteer een onderwerp"),
  message: z.string().min(10, "Bericht moet minimaal 10 karakters bevatten"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactSection() {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Bericht verzonden!",
        description: "We nemen zo snel mogelijk contact met je op.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Contact & Locatie
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Vragen over onze producten? Neem contact op of kom langs in Groningen.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Digimaatwerk Siroperij
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-purple-500 mt-1 w-5 h-5" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Adres</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Star Numanstraat<br/>9717JE Groningen
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="text-purple-500 mt-1 w-5 h-5" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Telefoon</p>
                      <p className="text-gray-600 dark:text-gray-400">+31 6 12345678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="text-purple-500 mt-1 w-5 h-5" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Email</p>
                      <p className="text-gray-600 dark:text-gray-400">info@digimaatwerk-kombucha.nl</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="text-purple-500 mt-1 w-5 h-5" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Openingstijden</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Ma-Vr: 09:00-17:00<br/>Op afspraak
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Links */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Volg ons</h4>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white hover:from-purple-600 hover:to-purple-700"
                    onClick={() => window.open('https://www.instagram.com/pluk_en_poot/', '_blank')}
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h3 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Stuur ons een bericht
                </h3>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">Voornaam</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        className="mt-1"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Achternaam</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        className="mt-1"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      className="mt-1"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Onderwerp</Label>
                    <Select onValueChange={(value) => form.setValue("subject", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Kies een onderwerp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="algemeen">Algemene vraag</SelectItem>
                        <SelectItem value="product">Product informatie</SelectItem>
                        <SelectItem value="workshop">Workshop bestelling</SelectItem>
                        <SelectItem value="bulk">Bulk bestelling</SelectItem>
                        <SelectItem value="samenwerking">Samenwerking</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.subject && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Bericht</Label>
                    <Textarea
                      id="message"
                      {...form.register("message")}
                      placeholder="Vertel ons over je vraag of opmerking..."
                      className="mt-1"
                      rows={5}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Send className="mr-2 w-4 h-4" />
                    {contactMutation.isPending ? "Bezig..." : "Verzend Bericht"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            

          </div>
        </div>
      </div>
    </section>
  );
}
