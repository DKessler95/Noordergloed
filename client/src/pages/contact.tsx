import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Clock, Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (contactData: any) => {
      return await apiRequest("POST", "/api/contact", contactData);
    },
    onSuccess: () => {
      toast({
        title: "Bericht verzonden!",
        description: "We nemen binnen 24 uur contact met je op.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verzenden mislukt",
        description: error.message || "Er ging iets mis bij het verzenden van je bericht",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-500 text-white text-lg px-4 py-2">
            Contact & Locatie
          </Badge>
          <h1 className="font-display text-5xl font-bold mb-6">
            <span className="brewery-text-gradient">Neem Contact Op</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Heb je vragen over onze kombucha, workshops of ramen avonden? 
            We helpen je graag verder!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Contact Information */}
          <div className="space-y-8">
            {/* Location Card */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <MapPin className="w-5 h-5 mr-2" />
                  Locatie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Brouwerij Noordergloed</h3>
                  <p className="text-muted-foreground">
                    Noorderhaven 12<br />
                    9712 GX Groningen<br />
                    Nederland
                  </p>
                </div>
                
                {/* Map placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-amber-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-orange-600">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Interactieve kaart</p>
                    <p className="text-sm">Klik voor routekaart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Gegevens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-orange-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@noordergloed.nl</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-orange-600" />
                  <div>
                    <p className="font-medium">Telefoon</p>
                    <p className="text-muted-foreground">+31 50 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Clock className="w-5 h-5 mr-2" />
                  Openingstijden
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Maandag - Donderdag</span>
                  <span>10:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Vrijdag</span>
                  <span>10:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Zaterdag</span>
                  <span>09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Zondag</span>
                  <span className="text-red-600">Gesloten</span>
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Let op:</strong> Ramen avonden alleen op vrijdag 17:00-19:00
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Contact Form */}
          <div className="space-y-8">
            <Card className="shadow-2xl border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl font-display brewery-text-gradient">
                  Stuur ons een bericht
                </CardTitle>
                <p className="text-muted-foreground">
                  Vul onderstaand formulier in en we nemen zo snel mogelijk contact op
                </p>
              </CardHeader>
              <CardContent className="pb-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Naam *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="je.email@example.com"
                        className="border-orange-200 focus:border-orange-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Telefoonnummer
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+31 6 12345678"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Bericht *
                    </Label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Stel hier je vraag of deel je opmerking..."
                      className="w-full min-h-[120px] px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:border-orange-400 resize-none"
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full brewery-gradient text-white text-lg py-3 hover:scale-105 transition-all duration-300"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      "Verzenden..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Verstuur Bericht
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mb-0">
                    * Verplichte velden. We behandelen je gegevens vertrouwelijk.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Card */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle>Veelgestelde Vragen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold mb-1">Kunnen we langskomen zonder afspraak?</h4>
                  <p className="text-sm text-muted-foreground">
                    Ja, je bent welkom tijdens onze openingstijden. Voor workshops en ramen avonden is wel reservering nodig.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold mb-1">Hoe lang van tevoren moet ik reserveren?</h4>
                  <p className="text-sm text-muted-foreground">
                    Voor ramen avonden adviseren we minstens 1 week van tevoren. Workshops kunnen vaak ook last-minute.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold mb-1">Is er parkeergelegenheid?</h4>
                  <p className="text-sm text-muted-foreground">
                    Er is beperkt parkeren voor de deur. Wij adviseren om met de fiets of openbaar vervoer te komen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}