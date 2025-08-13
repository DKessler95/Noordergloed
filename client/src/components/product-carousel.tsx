import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Product } from "@shared/schema";

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter featured products
  const featuredProducts = (products as Product[]).filter((product: Product) => product.featured || product.category === "kombucha");
  
  if (featuredProducts.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.min(featuredProducts.length, 4));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.min(featuredProducts.length, 4)) % Math.min(featuredProducts.length, 4));
  };

  return (
    <section id="featured-products" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4">
            <span className="brewery-text-gradient">Onze Specialiteiten</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Ontdek onze handgemaakte kombucha collectie, gebrouwen met liefde en lokale ingrediënten
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.slice(0, 8).map((product: Product) => (
            <div key={product.id} className="w-full">
                  <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 border-orange-200/50 hover:border-orange-300">
                    <div className="relative">
                      {/* Product Image */}
                      <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-200 relative overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-32 h-32 brewery-gradient rounded-full opacity-20"></div>
                          </div>
                        )}
                        
                        {/* Badge */}
                        {product.badges && product.badges.length > 0 && (
                          <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                            {product.badges[0]}
                          </Badge>
                        )}

                        {/* Stock Indicator */}
                        {product.stock <= 5 && product.stock > 0 && (
                          <Badge variant="destructive" className="absolute top-4 right-4">
                            Laatste {product.stock}!
                          </Badge>
                        )}

                        {/* Star Rating */}
                        <div className="absolute bottom-4 right-4 flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                              {product.name}
                            </h3>
                            <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-orange-600">
                              €{parseFloat(product.price.toString()).toFixed(2)}
                            </div>
                            
                            <Button 
                              className="brewery-gradient text-white hover:scale-105 transition-all duration-200 rounded-full"
                              onClick={() => window.location.href = `/webshop?product=${product.id}`}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Bestel Nu
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="brewery-gradient text-white px-12 py-4 text-xl rounded-full hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = "/webshop"}
          >
            Bekijk Alle Producten
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </div>
    </section>
  );
}