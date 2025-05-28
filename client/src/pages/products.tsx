import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, Eye, Package } from "lucide-react";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Home
              </Link>
            </Button>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Product Pagina's
            </h1>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <Edit3 className="w-4 h-4 mr-2" />
              Admin Panel
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-display">
                    {product.name}
                  </CardTitle>
                  <Badge variant="secondary">
                    ID: {product.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Geen afbeelding
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                      {product.stock > 0 ? `${product.stock} op voorraad` : "Uitverkocht"}
                    </Badge>
                  </div>
                  
                  {product.badges && product.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.badges.map((badge) => (
                        <Badge key={badge} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button asChild className="flex-1" variant="outline">
                    <Link href={`/products/${product.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Bekijk
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href={`/admin#edit-${product.id}`}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Bewerken
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Geen producten gevonden
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Voeg je eerste product toe via het admin panel
            </p>
            <Button asChild>
              <Link href="/admin">
                Naar Admin Panel
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}