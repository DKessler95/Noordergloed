import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Star, Leaf, Heart, Package, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StockIndicator } from "@/components/stock-indicator";
import { ProductCard } from "@/components/product-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

// Form validation schema
const orderSchema = z.object({
  customerName: z.string().min(1, "Naam is verplicht"),
  customerEmail: z.string().email("Ongeldig e-mailadres"),
  customerPhone: z.string().optional(),
  quantity: z.number().min(1, "Minimaal 1 product"),
  notes: z.string().optional(),
  productId: z.number(),
  totalAmount: z.string(),
  orderType: z.string(),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const productId = parseInt(params.id || "0");

  // All hooks must be called unconditionally
  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      quantity: 1,
      notes: "",
      productId: productId,
      totalAmount: "0",
      orderType: "product",
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data: OrderForm) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Bestelling geplaatst!",
        description: "Je bestelling is succesvol geplaatst.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Fout bij bestellen",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  // Get single product
  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () => apiRequest("GET", `/api/products/${productId}`),
  }) as { data: Product | undefined, isLoading: boolean };

  // Get all products for carousel
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const onSubmit = (data: OrderForm) => {
    if (product) {
      const finalData = {
        ...data,
        productId: product.id,
        totalAmount: (parseFloat(product.price) * data.quantity).toFixed(2),
      };
      orderMutation.mutate(finalData);
    }
  };

  // Loading state
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

  // Product not found
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

  // Product data is available, continue with rendering
  const isElderflower = product?.name?.includes("Vlierbloesem") ?? false;
  const isRose = product?.name?.includes("Rozen") ?? false;
  const otherProducts = allProducts?.filter(p => p.id !== product?.id) || [];

  const getProductTheme = () => {
    if (isElderflower) {
      return {
        gradient: "from-yellow-100 via-green-50 to-blue-50 dark:from-yellow-900/20 dark:via-green-900/20 dark:to-blue-900/20",
        accent: "text-yellow-600 dark:text-yellow-400",
        button: "bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600",
        badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      };
    } else if (isRose) {
      return {
        gradient: "from-pink-100 via-rose-50 to-red-50 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-red-900/20",
        accent: "text-rose-600 dark:text-rose-400",
        button: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
        badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400",
      };
    }
    return {
      gradient: "from-blue-100 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20",
      accent: "text-purple-600 dark:text-purple-400",
      button: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
      badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    };
  };

  const theme = getProductTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar collectie
        </Button>
      </div>

      {/* Product Hero */}
      <div className={`bg-gradient-to-br ${theme.gradient} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="order-1 lg:order-1">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <Package className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="order-2 lg:order-2 space-y-8">
              <div>
                <Badge className={theme.badge}>
                  {product.category}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-4">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-4xl font-display font-bold ${theme.accent}`}>
                  {formatPrice(product.price)}
                </span>
                <StockIndicator 
                  current={product.stock} 
                  max={product.maxStock} 
                  productName={product.name}
                />
              </div>

              {/* Features */}
              {isElderflower && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Leaf className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Handgeplukt</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Bij Hamburgervijver</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 dark:border-green-800">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Puur Natuurlijk</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Geen kunstmatige toevoegingen</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {isRose && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border-rose-200 dark:border-rose-800">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Eigen Tuin</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Verse rozen uit onze tuin</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-pink-200 dark:border-pink-800">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Biologisch</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Zonder pesticiden</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Bestel {product.name}</CardTitle>
            <CardDescription>
              Vul je gegevens in om deze artisanale siroop te bestellen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naam *</FormLabel>
                        <FormControl>
                          <Input placeholder="Je volledige naam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="je@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefoon</FormLabel>
                        <FormControl>
                          <Input placeholder="06-12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aantal *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max={product.stock}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opmerkingen</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Bijzondere wensen of opmerkingen..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Totaal</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPrice((parseFloat(product.price) * (form.watch("quantity") || 1)).toFixed(2))}
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={orderMutation.isPending || product.stock === 0}
                    className={`${theme.button} text-white px-8 py-3 text-lg font-semibold`}
                    size="lg"
                  >
                    {orderMutation.isPending ? "Bezig..." : product.stock === 0 ? "Uitverkocht" : "Bestellen"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      {otherProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">
            Andere Producten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProducts.slice(0, 3).map((otherProduct) => (
              <ProductCard key={otherProduct.id} product={otherProduct} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}