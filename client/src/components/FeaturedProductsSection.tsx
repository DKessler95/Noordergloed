import { Award, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Link } from "wouter";

function FeaturedProductsSection() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: false,
  });

  // Get featured products (from category "andere")
  const featuredProducts = products.filter(product => product.category === 'andere' && !product.featured).slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-l from-purple-50/30 to-transparent dark:from-purple-950/10 dark:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Decorative Space */}
          <div className="hidden lg:block">
            <div className="w-full h-96 bg-gradient-to-br from-purple-100/40 to-pink-200/30 rounded-3xl flex items-center justify-center">
              <div className="text-center text-purple-300">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-16 h-16 text-purple-500/40" />
                </div>
                <p className="text-lg font-display">Lokale Specialiteiten</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">
                <span className="brewery-text-gradient">Uitgelichte Producten</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Naast onze kombucha en workshops bieden we ook andere lokale 
                specialiteiten aan. Van seizoensgebonden jam tot verse limonade.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {featuredProducts.map((product, index) => (
                <Link key={product.id} href={`/product/${product.id}`} className="block">
                  <Card className={`border-2 border-purple-100 hover:border-purple-300 transition-colors group cursor-pointer ${index % 2 === 1 ? 'ml-4' : ''}`}>
                    <CardContent className="p-6 text-center">
                      <div className="aspect-square w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {(product.imagePath || product.imageUrl) ? (
                          <img 
                            src={(product.imagePath || product.imageUrl) as string} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-2xl text-white">
                            {product.name.includes('jam') ? '🍓' : 
                             product.name.includes('ebak') ? '🥐' :
                             product.name.includes('imonade') ? '🍋' : '✨'}
                          </div>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="font-bold text-purple-600">€{product.price}</span>
                        {product.stock <= 5 && (
                          <Badge variant="secondary" className="text-xs">Beperkt</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/webshop">
                <button className="brewery-gradient text-white px-12 py-4 text-xl rounded-full hover:scale-105 transition-all duration-300 font-semibold">
                  Bekijk Alle Producten
                  <span className="ml-3">→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;