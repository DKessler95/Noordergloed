import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, LogOut, Check, X, Calendar, Mail, Upload, Eye, Save, Image } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import type { Product, WorkshopOrder } from "@shared/schema";
import { ProductImageUploader } from "@/components/ProductImageUploader";

// Live Product Editor Component
function LiveProductEditor({ productId, products, categories, updateProductMutation }: {
  productId: number;
  products: Product[];
  categories: string[];
  updateProductMutation: any;
}) {
  const product = products.find((p: Product) => p.id === productId);
  const [editData, setEditData] = useState<any>(product || {});

  // Update editData when product changes
  useEffect(() => {
    if (product) {
      setEditData(product);
    }
  }, [product]);

  if (!product) return null;

  const handleSave = () => {
    updateProductMutation.mutate({
      id: product.id,
      data: editData
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-green-700 mb-4 bg-green-100 p-3 rounded-md">
        <strong>Live editing voor:</strong> {product.name} - Wijzig de velden hieronder en klik op "Opslaan" om de changes live te zien.
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Naam</Label>
          <Input
            value={editData.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Prijs (€)</Label>
          <Input
            type="text"
            value={editData.price || ""}
            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label>Beschrijving</Label>
        <Textarea
          value={editData.description || ""}
          rows={3}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
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
        <div>
          <Label>Voorraad</Label>
          <Input
            type="number"
            value={editData.stock || 0}
            onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>Max Voorraad</Label>
          <Input
            type="number"
            value={editData.maxStock || 0}
            onChange={(e) => setEditData({ ...editData, maxStock: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div>
        <Label>Product Afbeelding</Label>
        <ProductImageUploader
          productId={product.id}
          currentImageUrl={editData.imageUrl || editData.imagePath}
          onImageUploaded={(imageUrl) => setEditData({ ...editData, imageUrl })}
        />
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
  
  // All hooks must be at the top before any conditional logic
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
      toast({
        title: "Product toegevoegd",
        description: "Het nieuwe product is succesvol toegevoegd.",
      });
    },
  });

  const deleteWorkshopOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/workshop-orders/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workshop-orders"] });
      queryClient.refetchQueries({ queryKey: ["/api/workshop-orders"] });
      toast({
        title: "Workshop order verwijderd",
        description: "De workshop order is succesvol verwijderd.",
      });
    },
  });

  const confirmWorkshopOrderMutation = useMutation({
    mutationFn: async (date: Date) => {
      const response = await apiRequest("POST", `/api/workshop-orders/confirm`, { 
        date: date.toISOString() 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workshop-orders"] });
      queryClient.refetchQueries({ queryKey: ["/api/workshop-orders"] });
      toast({
        title: "Workshop orders bevestigd",
        description: "Alle workshop orders voor de geselecteerde datum zijn bevestigd en uitnodigingen zijn verzonden.",
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
      queryClient.refetchQueries({ queryKey: ["/api/workshop-orders"] });
      toast({
        title: "Status bijgewerkt",
        description: "De order status is succesvol aangepast.",
      });
    },
  });

  const sendIndividualConfirmationMutation = useMutation({
    mutationFn: async (order: WorkshopOrder) => {
      const response = await apiRequest("POST", `/api/workshop-orders/${order.id}/send-confirmation`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bevestigingsmail verzonden",
        description: "De bevestigingsmail is succesvol verzonden naar de klant.",
      });
    },
  });

  const sendKombuchaOrderConfirmationMutation = useMutation({
    mutationFn: async (order: any) => {
      const response = await apiRequest("POST", `/api/orders/${order.id}/send-confirmation`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bevestigingsmail verzonden",
        description: "De bevestigingsmail is succesvol verzonden naar de klant.",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/products/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      setEditProductData(null);
      toast({
        title: "Product bijgewerkt",
        description: "Het product is succesvol aangepast.",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product verwijderd",
        description: "Het product is succesvol verwijderd.",
      });
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/test-email", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test email verzonden",
        description: "Controleer je inbox op dckessler95@gmail.com",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test email mislukt",
        description: error.message || "Er ging iets mis bij het verzenden van de test email.",
        variant: "destructive",
      });
    },
  });

  const updateKombuchaOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Status bijgewerkt",
        description: "De bestelling status is succesvol aangepast.",
      });
    },
  });

  const deleteKombuchaOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/orders/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Bestelling verwijderd",
        description: "De bestelling is succesvol verwijderd.",
      });
    },
  });





  // Redirect if not authenticated
  useEffect(() => {
    if (!adminLoading && adminStatus && !(adminStatus as any).isAdmin) {
      setLocation('/admin/login');
    }
  }, [adminStatus, adminLoading, setLocation]);

  // Show loading while checking authentication
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (adminStatus && !(adminStatus as any).isAdmin) {
    return null;
  }

  const handleStockUpdate = (id: number, newStock: number) => {
    updateStockMutation.mutate({ id, stock: newStock });
  };

  const handleCreateProduct = () => {
    const cleanData = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      stock: parseInt(newProduct.stock) || 0,
      maxStock: parseInt(newProduct.maxStock) || 0,
      category: newProduct.category,
      imageUrl: newProduct.imageUrl || null,
      featured: newProduct.featured || false
    };
    createProductMutation.mutate(cleanData);
  };



  const handleDeleteWorkshopOrder = (id: number) => {
    deleteWorkshopOrderMutation.mutate(id);
  };

  const handleTestEmail = () => {
    testEmailMutation.mutate();
  };

  const handleConfirmWorkshopOrders = (date: Date) => {
    confirmWorkshopOrderMutation.mutate(date);
  };

  const handleUpdateOrderStatus = (id: number, status: string) => {
    updateKombuchaOrderStatusMutation.mutate({ id, status });
  };

  const handleDeleteOrder = (id: number) => {
    deleteKombuchaOrderMutation.mutate(id);
  };

  const handleSendOrderConfirmation = (order: any) => {
    sendKombuchaOrderConfirmationMutation.mutate(order);
  };

  const handleUpdateWorkshopOrderStatus = (id: number, status: string) => {
    updateWorkshopOrderStatusMutation.mutate({ id, status });
  };

  const handleSendIndividualConfirmation = (order: WorkshopOrder) => {
    sendIndividualConfirmationMutation.mutate(order);
  };



  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setEditProductData({ ...product });
  };

  const handleUpdateProduct = () => {
    if (editingProduct && editProductData) {
      updateProductMutation.mutate({ 
        id: editingProduct, 
        updates: {
          ...editProductData,
          stock: parseInt(editProductData.stock) || 0,
          maxStock: parseInt(editProductData.maxStock) || 0,
        }
      });
    }
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const addBadge = () => {
    if (newBadge && !availableBadges.includes(newBadge)) {
      setAvailableBadges([...availableBadges, newBadge]);
      setNewBadge("");
    }
  };

  const toggleBadgeForProduct = (badge: string) => {
    const currentBadges = newProduct.badges || [];
    if (currentBadges.includes(badge)) {
      setNewProduct({
        ...newProduct,
        badges: currentBadges.filter(b => b !== badge)
      });
    } else {
      setNewProduct({
        ...newProduct,
        badges: [...currentBadges, badge]
      });
    }
  };

  // Group workshop orders by date
  const workshopOrdersByDate = (workshopOrders as WorkshopOrder[]).reduce((acc, order) => {
    const dateKey = new Date(order.preferredDate).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(order);
    return acc;
  }, {} as Record<string, WorkshopOrder[]>);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
      setLocation('/admin/login');
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het uitloggen.",
        variant: "destructive",
      });
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
            
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
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
                              {products.find((p: any) => p.id === order.productId)?.name || 'Onbekend product'}
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
                              {new Date(order.workshopDate).toLocaleDateString('nl-NL')}
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                              <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
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
                              >
                                {order.status === 'pending' ? 'Bevestigen' : 'Ongedaan maken'}
                              </Button>
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
                <CardDescription>Voeg een nieuw product toe aan de catalogus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Naam</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Product naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Prijs</Label>
                    <Input
                      id="price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="€10.99"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Product beschrijving"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stock">Voorraad</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxStock">Max Voorraad</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      value={newProduct.maxStock}
                      onChange={(e) => setNewProduct({ ...newProduct, maxStock: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categorie</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kombucha">Kombucha</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="accessoires">Accessoires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Product Afbeelding</Label>
                  <ProductImageUploader
                    currentImageUrl={newProduct.imageUrl}
                    onImageUploaded={(imageUrl) => setNewProduct(prev => ({ ...prev, imageUrl }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={newProduct.featured}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked })}
                  />
                  <Label htmlFor="featured">Uitgelicht product</Label>
                </div>

                <div className="space-y-2">
                  <Label>Badges</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {availableBadges.map((badge) => (
                      <Badge
                        key={badge}
                        variant={newProduct.badges.includes(badge) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleBadgeForProduct(badge)}
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
                    <Button onClick={addBadge} variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateProduct} 
                  className="w-full"
                  disabled={createProductMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createProductMutation.isPending ? "Toevoegen..." : "Product Toevoegen"}
                </Button>
              </CardContent>
            </Card>

            {/* Category Management */}
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
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Producten Beheer</CardTitle>
                <CardDescription>Bekijk en beheer bestaande producten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(products as Product[]).map((product: Product) => (
                    <div key={product.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                          <p className="text-lg font-bold text-green-600">{product.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.featured ? "default" : "secondary"}>
                            {product.featured ? "Uitgelicht" : "Normaal"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">Voorraad: {product.stock}/{product.maxStock}</span>
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                            max={product.maxStock}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setLiveEditingProduct(product.id)}
                            className="bg-green-50 hover:bg-green-100 text-green-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Live Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {product.badges && product.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.badges.map((badge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kombucha Bestellingen</CardTitle>
                <CardDescription>Beheer alle kombucha bestellingen en hun status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(orders as any[]).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Geen kombucha bestellingen gevonden
                    </div>
                  ) : (
                    (orders as any[]).map((order: any) => {
                      const product = (products as any[]).find((p: any) => p.id === order.productId);
                      return (
                        <div key={order.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{order.customerName}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerEmail}</p>
                              {order.customerPhone && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
                              )}
                              <div className="mt-2 space-y-1">
                                <p className="text-sm"><strong>Product:</strong> {product?.name || 'Onbekend product'}</p>
                                <p className="text-sm"><strong>Aantal:</strong> {order.quantity}</p>
                                <p className="text-sm"><strong>Totaal:</strong> €{order.totalAmount}</p>
                                <p className="text-sm"><strong>Bezorging:</strong> {order.deliveryMethod === 'delivery' ? 'Bezorgen' : 'Ophalen'}</p>
                                {order.deliveryMethod === 'delivery' && order.streetAddress && (
                                  <div className="text-sm">
                                    <strong>Adres:</strong> {order.streetAddress}, {order.postalCode} {order.city}, {order.country}
                                  </div>
                                )}
                                {order.notes && (
                                  <p className="text-sm text-gray-500 mt-1">Notities: {order.notes}</p>
                                )}
                                <p className="text-xs text-gray-400">Besteld op: {new Date(order.createdAt).toLocaleString('nl-NL')}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Select
                                value={order.status}
                                onValueChange={(status) => updateKombuchaOrderStatusMutation.mutate({ id: order.id, status })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="bevestigd">Bevestigd</SelectItem>
                                  <SelectItem value="klaar">Klaar</SelectItem>
                                  <SelectItem value="voltooid">Voltooid</SelectItem>
                                  <SelectItem value="geannuleerd">Geannuleerd</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  sendKombuchaOrderConfirmationMutation.mutate(order);
                                }}
                                disabled={sendKombuchaOrderConfirmationMutation.isPending}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteKombuchaOrderMutation.mutate(order.id);
                                }}
                                disabled={deleteKombuchaOrderMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workshop-orders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Workshop Bookings per Datum</CardTitle>
                  <CardDescription>Bekijk en beheer workshop bookings gegroepeerd per datum</CardDescription>
                </div>
                <Button
                  onClick={handleTestEmail}
                  disabled={testEmailMutation.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {testEmailMutation.isPending ? "Bezig..." : "Test Email"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(workshopOrdersByDate).map(([date, orders]) => (
                    <div key={date} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {new Date(date + 'T12:00:00').toLocaleDateString('nl-NL', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {orders.length} orders • {orders.reduce((sum, order) => sum + order.servings, 0)} porties totaal
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge variant={orders.reduce((sum, order) => sum + order.servings, 0) >= 6 ? 'destructive' : 'default'}>
                              {orders.reduce((sum, order) => sum + order.servings, 0) >= 6 ? 'VOL' : `${6 - orders.reduce((sum, order) => sum + order.servings, 0)} plekken beschikbaar`}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleConfirmWorkshopOrders(new Date(date + 'T12:00:00'))}
                            disabled={confirmWorkshopOrderMutation.isPending || orders.every(order => order.status === 'confirmed')}
                            variant={orders.some(order => order.status === 'pending') ? 'default' : 'outline'}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {orders.every(order => order.status === 'confirmed') ? 'Bevestigd' : 'Bevestig Alle'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {orders.map((order: WorkshopOrder) => (
                          <div key={order.id} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium">{order.customerName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerEmail}</p>
                                {order.customerPhone && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
                                )}
                                <div className="flex items-center mt-1 space-x-3">
                                  <span className="text-sm">Porties: {order.servings}</span>
                                </div>
                                {order.notes && (
                                  <p className="text-sm text-gray-500 mt-1">Notities: {order.notes}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Select
                                  value={order.status}
                                  onValueChange={(status) => handleUpdateWorkshopOrderStatus(order.id, status)}
                                  disabled={updateWorkshopOrderStatusMutation.isPending}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Bevestigd</SelectItem>
                                    <SelectItem value="cancelled">Geannuleerd</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSendIndividualConfirmation(order);
                                  }}
                                  disabled={sendIndividualConfirmationMutation.isPending}
                                  title="Verstuur bevestigingsmail"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteWorkshopOrder(order.id);
                                  }}
                                  disabled={deleteWorkshopOrderMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(workshopOrdersByDate).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Geen workshop orders gevonden
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        {editingProduct && editProductData && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Product Bewerken</DialogTitle>
                <DialogDescription>
                  Pas de productinformatie aan
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Naam</Label>
                    <Input
                      id="edit-name"
                      value={editProductData.name || ""}
                      onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Prijs</Label>
                    <Input
                      id="edit-price"
                      value={editProductData.price || ""}
                      onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Beschrijving</Label>
                  <Textarea
                    id="edit-description"
                    value={editProductData.description || ""}
                    onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-stock">Voorraad</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editProductData.stock || ""}
                      onChange={(e) => setEditProductData({ ...editProductData, stock: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-maxStock">Max Voorraad</Label>
                    <Input
                      id="edit-maxStock"
                      type="number"
                      value={editProductData.maxStock || ""}
                      onChange={(e) => setEditProductData({ ...editProductData, maxStock: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Categorie</Label>
                    <Select
                      value={editProductData.category || "kombucha"}
                      onValueChange={(value) => setEditProductData({ ...editProductData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kombucha">Kombucha</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="accessoires">Accessoires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Product Afbeelding</Label>
                  <ProductImageUploader
                    productId={editingProduct}
                    currentImageUrl={editProductData.imageUrl}
                    onImageUploaded={(imageUrl) => setEditProductData({ ...editProductData, imageUrl })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-featured"
                    checked={editProductData.featured || false}
                    onCheckedChange={(checked) => setEditProductData({ ...editProductData, featured: checked })}
                  />
                  <Label htmlFor="edit-featured">Uitgelicht product</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleUpdateProduct} disabled={updateProductMutation.isPending}>
                    {updateProductMutation.isPending ? "Opslaan..." : "Opslaan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}