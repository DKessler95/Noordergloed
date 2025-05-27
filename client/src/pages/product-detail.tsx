import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StockIndicator } from "@/components/stock-indicator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  ShoppingCart, 
  CheckCircle, 
  MapPin, 
  Leaf, 
  Clock,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { Product } from "@shared/schema";

const orderSchema = z.object({
  customerName: z.string().min(1, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig email adres"),
  customerPhone: z.string().min(1, "Telefoon is verplicht"),
  quantity: z.number().min(1, "Minimaal 1 product").max(10, "Maximaal 10 producten"),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const productId = parseInt(params.id || "0");

  // Get single product
  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () => apiRequest("GET", `/api/products/${productId}`),
  }) as { data: Product | undefined, isLoading: boolean };

  // Get all products for carousel
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Early return if loading or no product to avoid undefined errors
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product niet gevonden
          </h1>
          <Button onClick={() => setLocation("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      quantity: 1,
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data: OrderForm) => {
      return apiRequest("POST", "/api/orders/syrup", {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        productId: product!.id,
        quantity: data.quantity,
        totalAmount: (parseFloat(product!.price) * data.quantity).toString(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Bestelling geplaatst!",
        description: `${product!.name} is toegevoegd aan je bestelling.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
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

  const onSubmit = (data: OrderForm) => {
    orderMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product niet gevonden
          </h1>
          <Button onClick={() => setLocation("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isElderflower = product?.name.includes("Vlierbloesem") || false;
  const isRose = product?.name.includes("Rozen") || false;
  const otherProducts = allProducts?.filter(p => p.id !== product?.id) || [];

  const getProductTheme = () => {
    if (isElderflower) {
      return {
        gradient: "from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700",
        badge: "bg-yellow-200 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100",
        accent: "text-yellow-600 dark:text-yellow-400",
        button: "bg-yellow-600 hover:bg-yellow-700",
      };
    }
    if (isRose) {
      return {
        gradient: "from-pink-50 to-pink-100 dark:from-gray-800 dark:to-gray-700",
        badge: "bg-pink-200 dark:bg-pink-600 text-pink-800 dark:text-pink-100",
        accent: "text-pink-600 dark:text-pink-400",
        button: "bg-pink-600 hover:bg-pink-700",
      };
    }
    return {
      gradient: "from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700",
      badge: "bg-purple-200 dark:bg-purple-600 text-purple-800 dark:text-purple-100",
      accent: "text-purple-600 dark:text-purple-400",
      button: "bg-purple-600 hover:bg-purple-700",
    };
  };

  const theme = getProductTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} transition-colors duration-300`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button 
            onClick={() => setLocation("/")} 
            variant="ghost" 
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar collectie
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={product.imageUrl || "/placeholder-syrup.jpg"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4">
              {isElderflower && (
                <>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <Leaf className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">Verse Vlierbloesem</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Seizoensgebonden</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <MapPin className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">Hamburgervijver</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Handgeplukt</p>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {isRose && (
                <>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">Eigen Tuin</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Star Numanstraat</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <Star className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">Delicate Smaak</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Subtiel bloemen</p>
                    </CardContent>
                  </Card>
                </>
              )}
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">100% Natuurlijk</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Geen toevoegingen</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Ambachtelijk</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Handgemaakt</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Info & Order Form */}
          <div className="space-y-8">
            <div>
              <Badge className={`${theme.badge} mb-4`}>
                {isElderflower ? "Seizoensspecialiteit" : isRose ? "Huistuin Delicatesse" : "Premium"}
              </Badge>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center space-x-4 mb-8">
                <span className={`font-display text-4xl font-bold ${theme.accent}`}>
                  €{product.price}
                </span>
                <div className="text-gray-500">
                  <span className="text-sm">per fles (1 liter)</span>
                </div>
              </div>
              
              <StockIndicator 
                current={product.stock} 
                max={product.maxStock}
                productName={product.name}
              />
            </div>

            <Separator />

            {/* Order Form */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Bestel Nu
                </h3>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
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
                      <Label htmlFor="quantity">Aantal flessen</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10"
                        {...form.register("quantity", { valueAsNumber: true })}
                        className="mt-1"
                      />
                      {form.formState.errors.quantity && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.quantity.message}
                        </p>
                      )}
                    </div>
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

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900 dark:text-white">Totaal</span>
                      <span className={`font-display text-2xl font-bold ${theme.accent}`}>
                        €{(parseFloat(product.price) * (form.watch("quantity") || 1)).toFixed(2)}
                      </span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={orderMutation.isPending || product.stock === 0}
                      className={`w-full ${theme.button} text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg`}
                    >
                      <ShoppingCart className="mr-2 w-4 h-4" />
                      {orderMutation.isPending ? "Bezig..." : product.stock === 0 ? "Uitverkocht" : "In Winkelwagen"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products Carousel */}
        {otherProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Ontdek Ook
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProducts.map((relatedProduct) => (
                <Card 
                  key={relatedProduct.id}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => setLocation(`/product/${relatedProduct.id}`)}
                >
                  <CardContent className="p-0">
                    <img 
                      src={relatedProduct.imageUrl || "/placeholder-syrup.jpg"} 
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {relatedProduct.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-display text-xl font-bold text-purple-600 dark:text-purple-400">
                          €{relatedProduct.price}
                        </span>
                        <Button size="sm" variant="outline">
                          Bekijk
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}