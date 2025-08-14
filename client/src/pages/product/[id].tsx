import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Package, Truck, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: false,
  });

  const product = products.find(p => p.id === parseInt(id || '0'));

  const addToCartMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Toegevoegd aan winkelwagen!",
        description: `${quantity}x ${product?.name} toegevoegd`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij toevoegen",
        description: error.message || "Er ging iets mis bij het toevoegen aan de winkelwagen",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock < quantity) {
      toast({
        title: "Onvoldoende voorraad",
        description: `Nog slechts ${product.stock} stuks beschikbaar`,
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      customerName: "Gast", // This would normally come from user session
      customerEmail: "gast@example.com", // This would normally come from user session
      customerPhone: "",
      deliveryMethod,
      totalAmount: `€${(parseFloat(product.price) * quantity).toFixed(2)}`,
      status: "pending"
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-display font-bold mb-8">Product niet gevonden</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar webshop
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left - Product Image */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/50 dark:to-amber-900/50 rounded-2xl overflow-hidden">
              {(product.imagePath || product.imageUrl) ? (
                <img 
                  src={product.imagePath || product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-orange-600 dark:text-orange-400" />
                </div>
              )}
            </div>

            {/* Product Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Product Kenmerken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.badges && product.badges.map((badge, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="w-4 h-4 text-orange-500 mr-2" />
                    <span className="text-sm">{badge}</span>
                  </div>
                ))}
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm">Lokaal geproduceerd in Groningen</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm">Hoogste kwaliteit ingrediënten</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Product Info & Purchase */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <Badge variant="outline" className="mb-2 text-orange-600 border-orange-300">
                {product.category === 'andere' ? 'Andere Producten' : product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
              <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-orange-600">€{product.price}</span>
                <span className="text-lg text-muted-foreground">per stuk</span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Stock Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Voorraad Status:</span>
                  {product.stock === 0 ? (
                    <Badge variant="destructive">Uitverkocht</Badge>
                  ) : product.stock <= 5 ? (
                    <Badge variant="destructive">Laatste {product.stock} stuks!</Badge>
                  ) : (
                    <Badge className="bg-green-500 text-white">{product.stock} op voorraad</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Purchase Options */}
            {product.stock > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Bestelling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Aantal:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        className="w-20 text-center"
                        min={1}
                        max={product.stock}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Delivery Method */}
                  <div className="space-y-2">
                    <span className="font-medium">Bezorging:</span>
                    <Select value={deliveryMethod} onValueChange={(value: 'pickup' | 'delivery') => setDeliveryMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Ophalen in Groningen
                          </div>
                        </SelectItem>
                        <SelectItem value="delivery">
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 mr-2" />
                            Bezorgen (+€2,50)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Total Price */}
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Totaal:</span>
                    <span className="text-orange-600">
                      €{((parseFloat(product.price) * quantity) + (deliveryMethod === 'delivery' ? 2.5 : 0)).toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="w-full brewery-gradient text-white text-lg py-3 hover:scale-105 transition-all duration-300"
                  >
                    {addToCartMutation.isPending ? "Toevoegen..." : "Toevoegen aan Winkelwagen"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Rating */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Klantbeoordeling:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">(4.8/5)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Products Section */}
        <FeaturedProductsSection />
      </div>
    </div>
  );
}