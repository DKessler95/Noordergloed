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
    <section className="py-12 bg-gradient-to-l from-purple-50/20 to-transparent dark:from-purple-950/5 dark:to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold mb-3">
            <span className="brewery-text-gradient">Andere Producten</span>
          </h2>
          <p className="text-muted-foreground">
            Ontdek ook onze andere lokale specialiteiten
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="block">
              <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors group cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <div className="aspect-square w-12 h-12 mx-auto mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {(product.imagePath || product.imageUrl) ? (
                      <img 
                        src={(product.imagePath || product.imageUrl) as string} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-lg text-white">
                        {product.name.includes('jam') ? '🍓' : 
                         product.name.includes('ebak') ? '🥐' :
                         product.name.includes('imonade') ? '🍋' : '✨'}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold mb-1">{product.name}</h3>
                  <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold text-purple-600 text-sm">€{product.price}</span>
                    {product.stock <= 5 && (
                      <Badge variant="secondary" className="text-xs">Beperkt</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/webshop">
            <button className="brewery-gradient text-white px-8 py-2 text-lg rounded-full hover:scale-105 transition-all duration-300 font-semibold">
              Alle Producten
              <span className="ml-2">→</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;