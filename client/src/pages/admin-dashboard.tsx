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
import { Trash2, Edit, Plus, LogOut, Check, X, Calendar, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import type { Product, RamenOrder } from "@shared/schema";

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
    category: "syrup",
    imageUrl: "",
    featured: false,
    limitedStock: false,
    badges: [] as string[]
  });
  const [availableBadges, setAvailableBadges] = useState(["Seizoenspecialiteit", "Huistuin delicatesse", "Premium"]);
  const [newBadge, setNewBadge] = useState("");

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

  const { data: ramenOrders = [] } = useQuery({
    queryKey: ["/api/ramen-orders"],
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
        category: "syrup",
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

  const deleteRamenOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/ramen-orders/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ramen-orders"] });
      queryClient.refetchQueries({ queryKey: ["/api/ramen-orders"] });
      toast({
        title: "Ramen order verwijderd",
        description: "De ramen order is succesvol verwijderd.",
      });
    },
  });

  const confirmRamenOrderMutation = useMutation({
    mutationFn: async (date: Date) => {
      const response = await apiRequest("POST", `/api/ramen-orders/confirm`, { 
        date: date.toISOString() 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ramen-orders"] });
      queryClient.refetchQueries({ queryKey: ["/api/ramen-orders"] });
      toast({
        title: "Ramen orders bevestigd",
        description: "Alle ramen orders voor de geselecteerde datum zijn bevestigd en uitnodigingen zijn verzonden.",
      });
    },
  });

  const updateRamenOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/ramen-orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ramen-orders"] });
      queryClient.refetchQueries({ queryKey: ["/api/ramen-orders"] });
      toast({
        title: "Status bijgewerkt",
        description: "De order status is succesvol aangepast.",
      });
    },
  });

  const sendIndividualConfirmationMutation = useMutation({
    mutationFn: async (order: RamenOrder) => {
      const response = await apiRequest("POST", `/api/ramen-orders/${order.id}/send-confirmation`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bevestigingsmail verzonden",
        description: "De bevestigingsmail is succesvol verzonden naar de klant.",
      });
    },
  });

  const sendSyrupOrderConfirmationMutation = useMutation({
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

  const updateSyrupOrderStatusMutation = useMutation({
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

  const deleteSyrupOrderMutation = useMutation({
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
    if (!adminLoading && adminStatus && !adminStatus.isAdmin) {
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
  if (adminStatus && !adminStatus.isAdmin) {
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



  const handleDeleteRamenOrder = (id: number) => {
    deleteRamenOrderMutation.mutate(id);
  };

  const handleTestEmail = () => {
    testEmailMutation.mutate();
  };

  const handleConfirmRamenOrders = (date: Date) => {
    confirmRamenOrderMutation.mutate(date);
  };

  const handleUpdateOrderStatus = (id: number, status: string) => {
    updateOrderStatusMutation.mutate({ id, status });
  };

  const handleDeleteOrder = (id: number) => {
    deleteOrderMutation.mutate(id);
  };

  const handleSendOrderConfirmation = (order: any) => {
    sendSyrupOrderConfirmationMutation.mutate(order);
  };

  const handleUpdateRamenOrderStatus = (id: number, status: string) => {
    updateRamenOrderStatusMutation.mutate({ id, status });
  };

  const handleSendIndividualConfirmation = (order: RamenOrder) => {
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

  // Group ramen orders by date
  const ramenOrdersByDate = (ramenOrders as RamenOrder[]).reduce((acc, order) => {
    const dateKey = new Date(order.preferredDate).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(order);
    return acc;
  }, {} as Record<string, RamenOrder[]>);

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Uitloggen
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Producten</TabsTrigger>
            <TabsTrigger value="orders">Siroop Bestellingen</TabsTrigger>
            <TabsTrigger value="ramen-orders">Ramen Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nieuw Product Toevoegen</CardTitle>
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
                        <SelectItem value="syrup">Siroop</SelectItem>
                        <SelectItem value="ramen">Ramen</SelectItem>
                        <SelectItem value="accessoires">Accessoires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Afbeelding URL</Label>
                  <Input
                    id="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
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
                <CardTitle>Siroop Bestellingen</CardTitle>
                <CardDescription>Beheer alle siroop bestellingen en hun status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(orders as any[]).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Geen siroop bestellingen gevonden
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
                                onValueChange={(status) => updateSyrupOrderStatusMutation.mutate({ id: order.id, status })}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Bevestigd</SelectItem>
                                  <SelectItem value="preparing">Voorbereiden</SelectItem>
                                  <SelectItem value="ready">Klaar</SelectItem>
                                  <SelectItem value="completed">Voltooid</SelectItem>
                                  <SelectItem value="cancelled">Geannuleerd</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  sendSyrupOrderConfirmationMutation.mutate(order);
                                }}
                                disabled={sendSyrupOrderConfirmationMutation.isPending}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteSyrupOrderMutation.mutate(order.id);
                                }}
                                disabled={deleteSyrupOrderMutation.isPending}
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

          <TabsContent value="ramen-orders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ramen Orders per Datum</CardTitle>
                  <CardDescription>Bekijk en beheer ramen pre-orders gegroepeerd per datum</CardDescription>
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
                  {Object.entries(ramenOrdersByDate).map(([date, orders]) => (
                    <div key={date} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {new Date(date).toLocaleDateString('nl-NL', { 
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
                            onClick={() => handleConfirmRamenOrders(new Date(date))}
                            disabled={confirmRamenOrderMutation.isPending || orders.every(order => order.status === 'confirmed')}
                            variant={orders.some(order => order.status === 'pending') ? 'default' : 'outline'}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {orders.every(order => order.status === 'confirmed') ? 'Bevestigd' : 'Bevestig Alle'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {orders.map((order: RamenOrder) => (
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
                                  onValueChange={(status) => handleUpdateRamenOrderStatus(order.id, status)}
                                  disabled={updateRamenOrderStatusMutation.isPending}
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
                                    handleDeleteRamenOrder(order.id);
                                  }}
                                  disabled={deleteRamenOrderMutation.isPending}
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
                  
                  {Object.keys(ramenOrdersByDate).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Geen ramen orders gevonden
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
                      value={editProductData.category || "syrup"}
                      onValueChange={(value) => setEditProductData({ ...editProductData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="syrup">Siroop</SelectItem>
                        <SelectItem value="ramen">Ramen</SelectItem>
                        <SelectItem value="accessoires">Accessoires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-imageUrl">Afbeelding URL</Label>
                  <Input
                    id="edit-imageUrl"
                    value={editProductData.imageUrl || ""}
                    onChange={(e) => setEditProductData({ ...editProductData, imageUrl: e.target.value })}
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