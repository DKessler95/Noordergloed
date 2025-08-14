import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Eye, X, LogOut, Save, Mail, Calendar, Image } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import type { Product, WorkshopOrder } from "@shared/schema";
import { ProductImageUploader } from "@/components/ProductImageUploader";

// Live Product Editor Component
function LiveProductEditor({ productId, products, categories, updateProductMutation, availableBadges }: {
  productId: number;
  products: Product[];
  categories: string[];
  updateProductMutation: any;
  availableBadges: string[];
}) {
  const product = products.find((p: Product) => p.id === productId);
  const [editData, setEditData] = useState<any>(product || {});

  // Update editData when product changes
  useEffect(() => {
    if (product) {
      setEditData(product);
    }
  }, [product]);

  const handleSave = () => {
    if (!product) return;
    
    console.log("Saving product data:", editData);
    
    updateProductMutation.mutate({
      id: productId,
      productData: {
        ...editData,
        price: parseFloat(editData.price) || 0,
        stock: parseInt(editData.stock) || 0,
        maxStock: parseInt(editData.maxStock) || 0,
      }
    });
  };

  if (!product) return <div>Product niet gevonden</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Productnaam</Label>
          <Input
            value={editData.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Prijs (€)</Label>
          <Input
            value={editData.price || ""}
            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label>Beschrijving</Label>
        <Textarea
          value={editData.description || ""}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Voorraad</Label>
          <Input
            type="number"
            value={editData.stock || ""}
            onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
          />
        </div>
        <div>
          <Label>Max Voorraad</Label>
          <Input
            type="number"
            value={editData.maxStock || ""}
            onChange={(e) => setEditData({ ...editData, maxStock: e.target.value })}
          />
        </div>
        <div>
          <Label>Categorie</Label>
          <Select
            value={editData.category || "kombucha"}
            onValueChange={(value) => setEditData({ ...editData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Product Afbeelding</Label>
        <ProductImageUploader
          currentImageUrl={editData.imageUrl}
          onImageUploaded={(imageUrl) => setEditData({ ...editData, imageUrl })}
        />
      </div>
      
      <div className="space-y-4">
        <Label>Tags/Badges</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {availableBadges.map((badge) => (
            <Badge
              key={badge}
              variant={(editData.badges || []).includes(badge) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const currentBadges = editData.badges || [];
                if (currentBadges.includes(badge)) {
                  setEditData({
                    ...editData,
                    badges: currentBadges.filter(b => b !== badge)
                  });
                } else {
                  setEditData({
                    ...editData,
                    badges: [...currentBadges, badge]
                  });
                }
              }}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={editData.featured || false}
            onCheckedChange={(checked) => setEditData({ ...editData, featured: checked })}
          />
          <Label>Uitgelicht</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={editData.limitedStock || false}
            onCheckedChange={(checked) => setEditData({ ...editData, limitedStock: checked })}
          />
          <Label>Beperkte voorraad</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button 
          onClick={handleSave} 
          disabled={updateProductMutation.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-1" />
          {updateProductMutation.isPending ? "Opslaan..." : "Opslaan & Live Updaten"}
        </Button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // State management
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    maxStock: "",
    category: "kombucha",
    imageUrl: "",
    featured: false,
    limitedStock: false,
    badges: [] as string[]
  });
  const [availableBadges, setAvailableBadges] = useState(["Seizoenspecialiteit", "Huistuin delicatesse", "Premium"]);
  const [newBadge, setNewBadge] = useState("");
  const [categories, setCategories] = useState(["kombucha", "andere", "workshop", "ramen"]);
  const [newCategory, setNewCategory] = useState("");
  const [liveEditingProduct, setLiveEditingProduct] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeSection, setActiveSection] = useState('add-product');

  // Check admin authentication
  const { data: adminStatus, isLoading: adminLoading } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // Fetch data
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: workshopOrders = [] } = useQuery({
    queryKey: ["/api/workshop-orders"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Mutations
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock }: { id: number; stock: number }) => {
      const response = await apiRequest("PATCH", `/api/products/${id}/stock`, { stock });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Voorraad bijgewerkt",
        description: "De voorraad is succesvol aangepast.",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest("POST", "/api/products", productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product aangemaakt",
        description: "Het nieuwe product is succesvol toegevoegd.",
      });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        maxStock: "",
        category: "kombucha",
        imageUrl: "",
        featured: false,
        limitedStock: false,
        badges: []
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, productData }: { id: number; productData: any }) => {
      console.log("Sending PATCH request with data:", productData);
      const response = await apiRequest("PATCH", `/api/products/${id}`, productData);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product bijgewerkt",
        description: "Wijzigingen zijn live doorgevoerd op de website.",
      });
      setLiveEditingProduct(null); // Close live editor on success
    },
    onError: (error: any) => {
      console.error("Error updating product:", error);
      toast({
        title: "Fout bij opslaan",
        description: error.message || "Er is een fout opgetreden bij het bijwerken van het product.",
        variant: "destructive",
      });
    },
  });

  const updateWorkshopOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/workshop-orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workshop-orders"] });
      toast({
        title: "Status bijgewerkt",
        description: "De workshop booking status is aangepast.",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Bestelling bijgewerkt",
        description: "De bestellingsstatus is aangepast en klant is geïnformeerd.",
      });
    },
  });

  const sendCustomerEmailMutation = useMutation({
    mutationFn: async ({ orderId, type }: { orderId: number; type: 'syrup' | 'workshop' }) => {
      const endpoint = type === 'syrup' ? `/api/orders/${orderId}/send-email` : `/api/workshop-orders/${orderId}/send-email`;
      const response = await apiRequest("POST", endpoint);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email verzonden",
        description: "Bevestiging email is naar de klant gestuurd.",
      });
    },
    onError: () => {
      toast({
        title: "Email fout",
        description: "Er is een probleem opgetreden bij het verzenden van de email.",
        variant: "destructive",
      });
    },
  });

  // Authentication redirect
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!(adminStatus as any)?.isAdmin) {
    setLocation('/admin');
    return null;
  }

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      setLocation('/admin');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 space-y-2">
              <button
                onClick={() => setActiveSection('add-product')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === 'add-product' 
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Plus className="h-5 w-5 mr-3" />
                Nieuw Product Toevoegen
              </button>
              
              <button
                onClick={() => setActiveSection('categories')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === 'categories' 
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Plus className="h-5 w-5 mr-3" />
                Categorie Toevoegen
              </button>
              
              <button
                onClick={() => setActiveSection('products')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === 'products' 
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Image className="h-5 w-5 mr-3" />
                Producten Beheer
              </button>
              
              <button
                onClick={() => setActiveSection('orders')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === 'orders' 
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Mail className="h-5 w-5 mr-3" />
                Kombucha Bestellingen
              </button>
              
              <button
                onClick={() => setActiveSection('workshop-orders')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === 'workshop-orders' 
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="h-5 w-5 mr-3" />
                Workshop Bookings
              </button>
            </div>
            
            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={handleLogout} variant="outline" className="w-full flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" />
                Uitloggen
              </Button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Nieuw Product Toevoegen */}
            {activeSection === 'add-product' && (
              <Card>
                <CardHeader>
                  <CardTitle>Nieuw Product Toevoegen</CardTitle>
                  <CardDescription>Voeg een nieuw product toe aan de catalogus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Productnaam</Label>
                        <Input
                          placeholder="Bijv. Gember Kombucha"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Beschrijving</Label>
                        <Textarea
                          placeholder="Beschrijf je product..."
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Prijs (€)</Label>
                          <Input
                            placeholder="15.00"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Categorie</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>
                                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Voorraad</Label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Max Voorraad</Label>
                          <Input
                            type="number"
                            placeholder="50"
                            value={newProduct.maxStock}
                            onChange={(e) => setNewProduct({ ...newProduct, maxStock: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Product Afbeelding</Label>
                        <ProductImageUploader
                          currentImageUrl={newProduct.imageUrl}
                          onImageUploaded={(imageUrl) => setNewProduct(prev => ({ ...prev, imageUrl }))}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Tags/Badges</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {availableBadges.map((badge) => (
                            <Badge
                              key={badge}
                              variant={newProduct.badges.includes(badge) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                if (newProduct.badges.includes(badge)) {
                                  setNewProduct(prev => ({
                                    ...prev,
                                    badges: prev.badges.filter(b => b !== badge)
                                  }));
                                } else {
                                  setNewProduct(prev => ({
                                    ...prev,
                                    badges: [...prev.badges, badge]
                                  }));
                                }
                              }}
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Input
                            value={newBadge}
                            onChange={(e) => setNewBadge(e.target.value)}
                            placeholder="Nieuwe badge"
                          />
                          <Button onClick={() => {
                            if (newBadge.trim() && !availableBadges.includes(newBadge.trim())) {
                              setAvailableBadges(prev => [...prev, newBadge.trim()]);
                              setNewBadge("");
                              toast({
                                title: "Badge toegevoegd",
                                description: `Badge "${newBadge}" is toegevoegd aan beschikbare badges.`,
                              });
                            }
                          }} variant="outline" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={newProduct.featured}
                            onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked })}
                          />
                          <Label>Uitgelicht</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={newProduct.limitedStock}
                            onCheckedChange={(checked) => setNewProduct({ ...newProduct, limitedStock: checked })}
                          />
                          <Label>Beperkte voorraad</Label>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => {
                          createProductMutation.mutate({
                            ...newProduct,
                            price: parseFloat(newProduct.price) || 0,
                            stock: parseInt(newProduct.stock) || 0,
                            maxStock: parseInt(newProduct.maxStock) || 0,
                          });
                        }}
                        disabled={createProductMutation.isPending}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {createProductMutation.isPending ? "Bezig..." : "Product Aanmaken"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categorieën Beheren */}
            {activeSection === 'categories' && (
              <Card>
                <CardHeader>
                  <CardTitle>Categorie Beheer</CardTitle>
                  <CardDescription>Beheer productcategorieën</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-sm">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nieuwe categorie naam"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                      <Button 
                        onClick={() => {
                          if (newCategory.trim() && !categories.includes(newCategory.trim().toLowerCase())) {
                            setCategories(prev => [...prev, newCategory.trim().toLowerCase()]);
                            setNewCategory("");
                            toast({
                              title: "Categorie toegevoegd",
                              description: `Categorie "${newCategory}" is succesvol toegevoegd.`,
                            });
                          }
                        }}
                        disabled={!newCategory.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Toevoegen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Producten Beheer */}
            {activeSection === 'products' && (
              <div className="space-y-6">
                {/* Products List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Producten Beheer</CardTitle>
                    <CardDescription>Beheer je producten en voorraad</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Product</th>
                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Categorie</th>
                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Prijs</th>
                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Voorraad</th>
                            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Acties</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(products as Product[]).map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                <div className="flex items-center space-x-3">
                                  {product.imageUrl && (
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.name} 
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    {product.featured && (
                                      <Badge variant="secondary" className="text-xs">Uitgelicht</Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                <Badge variant="outline">{product.category}</Badge>
                              </td>
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                €{product.price}
                              </td>
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                    value={product.stock}
                                    onChange={(e) => {
                                      const newStock = parseInt(e.target.value) || 0;
                                      updateStockMutation.mutate({ id: product.id, stock: newStock });
                                    }}
                                    className="w-20"
                                  />
                                  <span className="text-sm text-gray-500">/ {product.maxStock}</span>
                                </div>
                              </td>
                              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setLiveEditingProduct(product.id)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Live Edit
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Editing Interface */}
                {liveEditingProduct && (
                  <Card className="border-2 border-green-200 bg-green-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <CardTitle className="text-green-800">Live Product Editing</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            window.open(`/`, '_blank');
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Bekijk Live
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLiveEditingProduct(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <LiveProductEditor 
                        productId={liveEditingProduct} 
                        products={products as Product[]} 
                        categories={categories}
                        updateProductMutation={updateProductMutation}
                        availableBadges={availableBadges}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Kombucha Bestellingen */}
            {activeSection === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Kombucha Bestellingen</CardTitle>
                  <CardDescription>Overzicht van alle kombucha bestellingen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Klant</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Product</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Aantal</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Totaal</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Datum</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              <div>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-sm text-gray-500">{order.customerEmail}</div>
                              </div>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              {(products as any[]).find((p: any) => p.id === order.productId)?.name || 'Onbekend product'}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{order.quantity}</td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">€{order.totalAmount}</td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              {new Date(order.createdAt).toLocaleDateString('nl-NL')}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newStatus = order.status === 'pending' ? 'confirmed' : order.status === 'confirmed' ? 'completed' : 'pending';
                                    updateOrderStatusMutation.mutate({ id: order.id, status: newStatus });
                                  }}
                                  disabled={updateOrderStatusMutation.isPending}
                                >
                                  {order.status === 'pending' ? 'Bevestigen' : 
                                   order.status === 'confirmed' ? 'Voltooien' : 'Reset'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => sendCustomerEmailMutation.mutate({ orderId: order.id, type: 'syrup' })}
                                  disabled={sendCustomerEmailMutation.isPending}
                                >
                                  <Mail className="h-4 w-4 mr-1" />
                                  Email
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Workshop Bookings */}
            {activeSection === 'workshop-orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Workshop Bookings</CardTitle>
                  <CardDescription>Overzicht van alle workshop bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Naam</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Email</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Telefoon</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Datum</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Status</th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(workshopOrders as WorkshopOrder[]).map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium">
                              {order.customerName}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              {order.customerEmail}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              {order.customerPhone}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              {new Date(order.preferredDate).toLocaleDateString('nl-NL')}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    const newStatus = order.status === 'pending' ? 'confirmed' : 'pending';
                                    updateWorkshopOrderStatusMutation.mutate({
                                      id: order.id,
                                      status: newStatus
                                    });
                                  }}
                                  disabled={updateWorkshopOrderStatusMutation.isPending}
                                >
                                  {order.status === 'pending' ? 'Bevestigen' : 'Ongedaan maken'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => sendCustomerEmailMutation.mutate({ orderId: order.id, type: 'workshop' })}
                                  disabled={sendCustomerEmailMutation.isPending}
                                >
                                  <Mail className="h-4 w-4 mr-1" />
                                  Email
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}