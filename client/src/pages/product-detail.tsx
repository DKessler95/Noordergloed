import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Leaf, Heart, Package, Shield, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StockIndicator } from "@/components/stock-indicator";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "@/components/shopping-cart";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin status on component mount and when localStorage changes
  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem('adminToken');
      setIsAdmin(!!token);
    };
    
    checkAdminStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, []);
  
  // Convert slug to product ID
  const productSlugMap: Record<string, number> = {
    "vlierbloesem-siroop": 1,
    "rozen-siroop": 2,
    "chicken-shoyu-ramen": 3
  };
  
  const productId = productSlugMap[params.slug as string] || parseInt(params.id || "0");

  // Get single product
  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () => apiRequest("GET", `/api/products/${productId}`).then(res => res.json()),
    enabled: productId > 0
  });

  // Get all products for carousel
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: Partial<Product>) => {
      return apiRequest("PATCH", `/api/products/${productId}`, updatedProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", productId] });
      setIsEditing(false);
      setEditData({});
      toast({
        title: "Product bijgewerkt!",
        description: "De productinformatie is succesvol opgeslagen.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij opslaan",
        description: error.message || "Er ging iets mis bij het opslaan.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (!product) return;
    setIsEditing(true);
    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      // Extended content fields
      story: product.story || getDefaultStory(product.name),
      ingredients: product.ingredients || getDefaultIngredients(product.name),
      nutrition: product.nutrition || getDefaultNutrition(),
      usage: product.usage || getDefaultUsage(product.name),
      // Detailed page content
      ingredientsTitle: product.ingredientsTitle || "Ingrediënten & Voedingswaarden",
      ingredientsContent: product.ingredientsContent || getDefaultIngredientsContent(product.name),
      nutritionContent: product.nutritionContent || getDefaultNutritionContent(),
      storyTitle: product.storyTitle || "Verhaal: De Hamburgervijver en de Ziel van de Siroop",
      storyContent: product.storyContent || getDefaultStoryContent(product.name),
    });
  };

  // Helper functions for default content
  const getDefaultStory = (name: string) => {
    if (name.includes("Vlierbloesem")) {
      return "Onze vlierbloesemstroop wordt met liefde gemaakt van verse vlierbloesems uit onze eigen tuin. De bloesems worden vroeg in de ochtend geplukt wanneer de dauw nog op de bloemblaadjes ligt, voor de meest intense smaak.";
    } else if (name.includes("Rozen")) {
      return "Deze rozensiroop wordt gemaakt van delicate rozenblaadjes uit onze eigen tuin aan de Star Numanstraat. Een subtiele bloemensmaak die perfect past bij thee of prosecco.";
    }
    return "Een verhaal over dit bijzondere product...";
  };

  const getDefaultIngredients = (name: string) => {
    if (name.includes("Vlierbloesem")) {
      return "Verse vlierbloesems, rietsuiker, water, citroenzuur";
    } else if (name.includes("Rozen")) {
      return "Biologische rozenblaadjes, rietsuiker, water, citroenzuur";
    }
    return "Natuurlijke ingrediënten van hoge kwaliteit";
  };

  const getDefaultNutrition = () => {
    return "Per 100ml: Energie 280kcal, Koolhydraten 70g, waarvan suikers 68g, Vet 0g, Eiwit 0g, Zout 0g";
  };

  const getDefaultUsage = (name: string) => {
    if (name.includes("Vlierbloesem")) {
      return "Perfect voor in thee, over ijs, in cocktails of als topping op desserts. Verdun met bruiswater voor een verfrissende limonade.";
    } else if (name.includes("Rozen")) {
      return "Heerlijk in thee, over yoghurt, in cocktails of als basis voor rozenlimonade. Ook perfect als topping voor taarten.";
    }
    return "Veelzijdig te gebruiken in dranken en desserts";
  };

  const getDefaultIngredientsContent = (name: string) => {
    if (name.includes("Vlierbloesem")) {
      return `Ingrediënten per 100 ml verdunde siroop (1:7 verhouding):
• Vlierbloeseminfusie (water, verse vlierbloesemschermen)
• Suiker (33 g per 100 ml siroop)
• Citroensap (vers geperst)
• Citroenzuur (natuurlijk conserveermiddel)`;
    } else if (name.includes("Rozen")) {
      return `Ingrediënten per 100 ml verdunde siroop (1:7 verhouding):
• Rozenextract (water, verse rozenblaadjes)
• Biologische rietsuiker (35 g per 100 ml siroop)
• Citroensap (vers geperst)
• Citroenzuur (natuurlijk conserveermiddel)`;
    }
    return "Natuurlijke ingrediënten van hoge kwaliteit";
  };

  const getDefaultNutritionContent = () => {
    return `Voedingswaarden per 100 ml verdund met water:

Energie: 138 kJ
Koolhydraten: 8,3 g
Waarvan suikers: 8,3 g

Bevat geen kunstmatige kleur-, geur- of smaakstoffen. Gegarandeerd glutenvrij en veganistisch.`;
  };

  const getDefaultStoryContent = (name: string) => {
    if (name.includes("Vlierbloesem")) {
      return `Midden in de levendige Groningse wijk Korreweg, verscholen tussen karakteristieke jaren-30-woningen en moderne flatgebouwen, ligt de Hamburgervijver – een oase van rust waar jouw vlierbloesemsiroop zijn roots vindt. Deze iconische vijver, onderdeel van het Molukkenplantsoen, werd in de jaren 30 aangelegd als onderdeel van Berlage's visie voor een groene gordel rond de stad.

Historische Verbinding

De naam "Hamburgervijver" verwijst naar de Hamburgerstraat, die al in 1503 werd vermeld als Curreweg. In de jaren 50 fietsten arbeiders hier dagelijks langs naar de nabijgelegen fabrieken aan het Boterdiep. Vandaag vangen karpervissers er nog steeds karpers tot 5 pond, omringd door treurwilgen en het gelach van kinderen die over het slingerpad rennen.

Natuur in de Stad

Het water reflecteert de seizoenen: in de lente bloeien dotterbloemen langs de oevers, in de zomer weerspiegelen de vlierbloesemschermen zich in het oppervlak. Juist deze bloesems, geplukt in de straten rondom Star Numanstraat, vormen het hart van je siroop. De combinatie van stadse dynamiek en wildpluktraditionele geeft elk flesje een uniek karakter – een eerbetoon aan Groningens vermogen om natuur en stadsleven te verweven.`;
    } else if (name.includes("Rozen")) {
      return `Deze rozensiroop wordt gemaakt van delicate rozenblaadjes uit onze eigen tuin aan de Star Numanstraat. Een subtiele bloemensmaak die perfect past bij thee of prosecco.

De Tuin

Onze rozentuin ligt verscholen in het hart van Groningen, waar elke ochtend de rozen worden geplukt wanneer de dauw nog op de blaadjes ligt. Dit zorgt voor de meest intense smaak en geur.

Ambachtelijk Proces

Elke fles bevat de essentie van tientallen rozen, zorgvuldig geoogst op het perfecte moment voor optimale smaak en geur. Het traditionele recept wordt al generaties doorgegeven.`;
    }
    return "Een verhaal over dit bijzondere product...";
  };

  const handleSave = () => {
    if (!product || !editData) return;
    updateProductMutation.mutate(editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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
                  <img
                    src={product.imageUrl || "/images/voorkant-siroop.png"}
                    alt={`${product.name} voorkant`}
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
                <div className="relative">
                  <img
                    src="/images/achterkant-siroop.png"
                    alt={`${product.name} achterkant`}
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="order-2 lg:order-2 space-y-8">
              {/* Edit Button */}
              <div className="flex justify-end">
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Bewerk Pagina
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={updateProductMutation.isPending} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Opslaan
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Annuleren
                    </Button>
                  </div>
                )}
              </div>

              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Naam</label>
                      <Input
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Beschrijving</label>
                      <Textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={4}
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prijs</label>
                      <Input
                        value={editData.price || ''}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                        placeholder="6.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Afbeelding URL</label>
                      <Input
                        value={editData.imageUrl || ''}
                        onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                        placeholder="/images/product.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Verhaal</label>
                      <Textarea
                        value={editData.story || ''}
                        onChange={(e) => setEditData({ ...editData, story: e.target.value })}
                        rows={3}
                        placeholder="Het verhaal achter dit product..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ingrediënten</label>
                      <Input
                        value={editData.ingredients || ''}
                        onChange={(e) => setEditData({ ...editData, ingredients: e.target.value })}
                        placeholder="Ingrediëntenlijst"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Voedingswaarde</label>
                      <Input
                        value={editData.nutrition || ''}
                        onChange={(e) => setEditData({ ...editData, nutrition: e.target.value })}
                        placeholder="Voedingswaarde per 100ml"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Gebruik</label>
                      <Textarea
                        value={editData.usage || ''}
                        onChange={(e) => setEditData({ ...editData, usage: e.target.value })}
                        rows={2}
                        placeholder="Hoe gebruik je dit product..."
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Badge className={theme.badge}>
                      {product.category}
                    </Badge>
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mt-4">
                      {product.name}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                      {product.description}
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`text-4xl font-display font-bold ${theme.accent}`}>
                    {formatPrice(product.price)}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voorraad</span>
                    <div className={`text-lg font-semibold ${theme.accent}`}>
                      {product.stock}/{product.maxStock} beschikbaar
                    </div>
                  </div>
                </div>
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

      {/* Main Content */}
      <div className="flex-1">
      
      {/* Detailed Product Information - Always show */}
      {product && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {isEditing && isAdmin && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Bewerk Mode Actief
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Je kunt nu alle content op deze pagina aanpassen. Scroll naar boven om de basis productinfo te bewerken.
              </p>
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Ingredients & Nutrition */}
            <div>
              {isEditing && isAdmin ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sectie Titel - Ingrediënten</label>
                    <Input
                      value={editData.ingredientsTitle || "Ingrediënten & Voedingswaarden"}
                      onChange={(e) => setEditData({ ...editData, ingredientsTitle: e.target.value })}
                      placeholder="Ingrediënten & Voedingswaarden"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ingrediënten Content</label>
                    <Textarea
                      value={editData.ingredientsContent || getDefaultIngredientsContent(product.name)}
                      onChange={(e) => setEditData({ ...editData, ingredientsContent: e.target.value })}
                      rows={8}
                      placeholder="Volledige ingrediënten tekst..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Voedingswaarden Content</label>
                    <Textarea
                      value={editData.nutritionContent || getDefaultNutritionContent()}
                      onChange={(e) => setEditData({ ...editData, nutritionContent: e.target.value })}
                      rows={6}
                      placeholder="Volledige voedingswaarden tekst..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                    {product.ingredientsTitle || "Ingrediënten & Voedingswaarden"}
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {product.ingredientsContent || getDefaultIngredientsContent(product.name)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {product.nutritionContent || getDefaultNutritionContent()}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Story */}
            <div>
              {isEditing && isAdmin ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Verhaal Titel</label>
                    <Input
                      value={editData.storyTitle || "Verhaal: De Hamburgervijver en de Ziel van de Siroop"}
                      onChange={(e) => setEditData({ ...editData, storyTitle: e.target.value })}
                      placeholder="Verhaal titel..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Verhaal Content</label>
                    <Textarea
                      value={editData.storyContent || getDefaultStoryContent(product.name)}
                      onChange={(e) => setEditData({ ...editData, storyContent: e.target.value })}
                      rows={12}
                      placeholder="Het volledige verhaal..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                    {product.storyTitle || "Verhaal: De Hamburgervijver en de Ziel van de Siroop"}
                  </h2>
                  
                  <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {product.storyContent || getDefaultStoryContent(product.name)}
                  </div>
                </>
              )}
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
      
      </div>

      <Footer />
    </div>
  );
}