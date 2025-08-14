import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Filter, Star } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Webshop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter and sort products
  const filteredProducts = (products as Product[])
    .filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
        case "price-high":
          return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
        case "stock":
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = Array.from(new Set((products as Product[]).map((p: Product) => p.category)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="brewery-gradient w-16 h-16 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-6xl font-bold mb-4">
            <span className="brewery-text-gradient">Webshop</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ontdek onze volledige collectie handgemaakte kombucha, workshops en accessoires
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl p-6 mb-8 shadow-lg border-2 border-orange-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Zoek producten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 border-orange-200 focus:border-orange-400">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Categorieën</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'andere' ? 'Andere Producten' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Sorteer op" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Naam A-Z</SelectItem>
                <SelectItem value="price-low">Prijs Laag-Hoog</SelectItem>
                <SelectItem value="price-high">Prijs Hoog-Laag</SelectItem>
                <SelectItem value="stock">Voorraad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product: Product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300 overflow-hidden">
              <div className="relative">
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-200 relative overflow-hidden">
                  {(product.imagePath || product.imageUrl) ? (
                    <img 
                      src={product.imagePath || product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to imageUrl if imagePath fails
                        const target = e.target as HTMLImageElement;
                        if (product.imagePath && product.imageUrl && target.src !== product.imageUrl) {
                          target.src = product.imageUrl;
                        } else {
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${(product.imagePath || product.imageUrl) ? 'hidden' : ''}`}>
                    <div className="w-24 h-24 brewery-gradient rounded-full opacity-20"></div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.featured && (
                      <Badge className="bg-orange-500 text-white">Featured</Badge>
                    )}
                    {product.badges && product.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary">{badge}</Badge>
                    ))}
                  </div>

                  {/* Stock Status */}
                  <div className="absolute top-4 right-4">
                    {product.stock === 0 ? (
                      <Badge variant="destructive">Uitverkocht</Badge>
                    ) : product.stock <= 5 ? (
                      <Badge variant="destructive">Laatste {product.stock}!</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white">{product.stock} op voorraad</Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-4 right-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2 text-orange-600 border-orange-300">
                        {product.category === 'andere' ? 'Andere Producten' : product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </Badge>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-orange-600">
                        €{parseFloat(product.price.toString()).toFixed(2)}
                      </div>
                      
                      <Button 
                        className="brewery-gradient text-white hover:scale-105 transition-all duration-200 rounded-full"
                        disabled={product.stock === 0}
                        onClick={() => {
                          if (product.category === "workshop") {
                            window.location.href = "/workshops";
                          } else {
                            // Handle product purchase
                            window.location.href = `/product/${product.id}`;
                          }
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.category === "workshop" ? "Boek Nu" : "Bestel"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 brewery-gradient rounded-full opacity-20 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-2">Geen producten gevonden</h3>
            <p className="text-muted-foreground">
              Probeer andere zoektermen of pas je filters aan
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}