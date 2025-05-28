import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Leaf, Heart, Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StockIndicator } from "@/components/stock-indicator";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "@/components/shopping-cart";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  
  // Convert slug to product ID
  const productSlugMap: Record<string, number> = {
    "vlierbloesem-siroop": 1,
    "rozen-siroop": 2
  };
  
  const productId = productSlugMap[params.slug as string] || parseInt(params.id || "0");

  // Get single product
  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () => apiRequest("GET", `/api/products/${productId}`),
  }) as { data: Product | undefined, isLoading: boolean };

  // Get all products for carousel
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

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
  const otherProducts = allProducts?.filter(p => p.id !== product?.id && p.category === product?.category) || [];

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
            {/* Product Images */}
            <div className="order-1 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
                    <img
                      src="/images/voorkant-siroop.png"
                      alt={`${product.name} voorkant`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
                    <img
                      src="/images/achterkant-siroop.png"
                      alt={`${product.name} achterkant`}
                      className="w-full h-full object-cover"
                    />
                  </div>
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

              {/* Add to Cart Button */}
              <div className="pt-4">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Product Information */}
      {isElderflower && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Ingredients & Nutrition */}
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                Ingrediënten & Voedingswaarden
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Ingrediënten per 100 ml verdunde siroop (1:7 verhouding):
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Vlierbloeseminfusie (water, verse vlierbloesemschermen)</li>
                    <li>• Suiker (33 g per 100 ml siroop)</li>
                    <li>• Citroensap (vers geperst)</li>
                    <li>• Citroenzuur (natuurlijk conserveermiddel)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Voedingswaarden per 100 ml verdund met water:
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Energie</div>
                        <div className="text-gray-600 dark:text-gray-300">138 kJ</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Koolhydraten</div>
                        <div className="text-gray-600 dark:text-gray-300">8,3 g</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Waarvan suikers</div>
                        <div className="text-gray-600 dark:text-gray-300">8,3 g</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                    Bevat geen kunstmatige kleur-, geur- of smaakstoffen. Gegarandeerd glutenvrij en veganistisch.
                  </p>
                </div>
              </div>
            </div>

            {/* Story */}
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                Verhaal: De Hamburgervijver en de Ziel van de Siroop
              </h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Midden in de levendige Groningse wijk Korreweg, verscholen tussen karakteristieke jaren-30-woningen en moderne flatgebouwen, ligt de Hamburgervijver – een oase van rust waar jouw vlierbloesemsiroop zijn roots vindt. Deze iconische vijver, onderdeel van het Molukkenplantsoen, werd in de jaren 30 aangelegd als onderdeel van Berlage's visie voor een groene gordel rond de stad.
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Historische Verbinding
                  </h3>
                  <p>
                    De naam "Hamburgervijver" verwijst naar de Hamburgerstraat, die al in 1503 werd vermeld als Curreweg. In de jaren 50 fietsten arbeiders hier dagelijks langs naar de nabijgelegen fabrieken aan het Boterdiep. Vandaag vangen karpervissers er nog steeds karpers tot 5 pond, omringd door treurwilgen en het gelach van kinderen die over het slingerpad rennen.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Natuur in de Stad
                  </h3>
                  <p>
                    Het water reflecteert de seizoenen: in de lente bloeien dotterbloemen langs de oevers, in de zomer weerspiegelen de vlierbloesemschermen zich in het oppervlak. Juist deze bloesems, geplukt in de straten rondom Star Numanstraat, vormen het hart van je siroop. De combinatie van stadse dynamiek en wildpluktraditionele geeft elk flesje een uniek karakter – een eerbetoon aan Groningens vermogen om natuur en stadsleven te verweven.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {otherProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">
            Andere Producten
          </h2>
          <div className="grid grid-cols-1 gap-12">
            {otherProducts.slice(0, 3).map((otherProduct) => (
              <div key={otherProduct.id} className="w-full max-w-none">
                <ProductCard product={otherProduct} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}