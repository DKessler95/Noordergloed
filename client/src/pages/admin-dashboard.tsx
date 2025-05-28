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
import { Trash2, Edit, Plus, LogOut, Check, X, Calendar } from "lucide-react";
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
      toast({
        title: "Ramen order verwijderd",
        description: "De ramen order is succesvol verwijderd.",
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Producten</TabsTrigger>
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ramen-orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ramen Orders</CardTitle>
                <CardDescription>Bekijk en beheer ramen pre-orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(ramenOrders as RamenOrder[]).map((order: RamenOrder) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{order.customerName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerEmail}</p>
                          {order.customerPhone && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
                          )}
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {new Date(order.preferredDate).toLocaleDateString('nl-NL')}
                            </span>
                            <span className="text-sm">Porties: {order.servings}</span>
                            <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                          {order.notes && (
                            <p className="text-sm text-gray-500 mt-1">Notities: {order.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRamenOrder(order.id)}
                          disabled={deleteRamenOrderMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}