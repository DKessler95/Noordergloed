import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, Plus, Users, ShoppingCart, LogOut, Edit, Save, X, Check, Upload, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Product, RamenOrder } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<any>(null);
  const [categories, setCategories] = useState(["syrup", "ramen", "accessoires"]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newBadge, setNewBadge] = useState("");
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

  // Fetch data
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: ramenOrders = [] } = useQuery({
    queryKey: ["/api/ramen-orders"],
  });

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock }: { id: number; stock: number }) => {
      const response = await apiRequest("PATCH", `/api/products/${id}/stock`, { stock });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Voorraad bijgewerkt!" });
      setEditingProduct(null);
    },
    onError: () => {
      toast({ title: "Fout bij bijwerken voorraad", variant: "destructive" });
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const cleanData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: parseInt(productData.stock) || 0,
        maxStock: parseInt(productData.maxStock) || 0,
        category: productData.category,
        imageUrl: productData.imageUrl || null,
        featured: productData.featured || false
      };
      
      const response = await apiRequest("POST", "/api/products", cleanData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product toegevoegd!" });
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
      setSelectedImage(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Fout bij toevoegen product", 
        description: error.message || "Controleer alle velden",
        variant: "destructive" 
      });
    },
  });

  // Update ramen order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/ramen-orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ramen-orders"] });
      toast({ title: "Bestelling status bijgewerkt!" });
    },
    onError: () => {
      toast({ title: "Fout bij bijwerken status", variant: "destructive" });
    },
  });

  // Delete ramen order mutation
  const deleteRamenOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/ramen-orders/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ramen-orders"] });
      toast({ title: "Ramen bestelling verwijderd!" });
    },
    onError: () => {
      toast({ title: "Fout bij verwijderen bestelling", variant: "destructive" });
    },
  });

  const handleStockUpdate = (productId: number, newStock: number) => {
    updateStockMutation.mutate({ id: productId, stock: newStock });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate(newProduct);
  };

  const logout = () => {
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/attached_assets/ik_elfie.png" 
                alt="Pluk & Poot Logo" 
                className="w-8 h-8 rounded object-cover"
              />
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Pluk & Poot CMS
              </h1>
            </div>
            <Button onClick={logout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Uitloggen
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Producten</TabsTrigger>
            <TabsTrigger value="stock">Voorraad</TabsTrigger>
            <TabsTrigger value="orders">Ramen Bestellingen</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Add New Product */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nieuw Product Toevoegen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Naam</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Prijs (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Voorraad</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxStock">Max Voorraad</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      value={newProduct.maxStock}
                      onChange={(e) => setNewProduct({ ...newProduct, maxStock: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categorie</Label>
                    <div className="space-y-2">
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nieuwe categorie"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                              setCategories([...categories, newCategory.trim()]);
                              setNewCategory("");
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {categories.map((cat) => (
                          <div key={cat} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                            {cat}
                            {categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setCategories(categories.filter(c => c !== cat))}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="imageUpload">Afbeelding</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedImage(file);
                              const imageUrl = `/images/${file.name}`;
                              setNewProduct({ ...newProduct, imageUrl });
                            }
                          }}
                          className="flex-1"
                        />
                        <Button type="button" size="sm" variant="outline">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Of voer URL in"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      />
                      {selectedImage && (
                        <p className="text-sm text-gray-600">Geselecteerd: {selectedImage.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Beschrijving</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows={3}
                      required
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="limitedStock"
                      checked={newProduct.limitedStock}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, limitedStock: checked })}
                    />
                    <Label htmlFor="limitedStock">Beperkte voorraad</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Badges</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {availableBadges.map((badge) => (
                          <div
                            key={badge}
                            onClick={() => {
                              const isSelected = newProduct.badges.includes(badge);
                              if (isSelected) {
                                setNewProduct({
                                  ...newProduct,
                                  badges: newProduct.badges.filter(b => b !== badge)
                                });
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  badges: [...newProduct.badges, badge]
                                });
                              }
                            }}
                            className={`cursor-pointer px-3 py-1 rounded-full text-sm transition-colors ${
                              newProduct.badges.includes(badge)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {badge}
                          </div>
                        ))}
                      </div>
                      {newProduct.badges.length > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Geselecteerd: {newProduct.badges.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={createProductMutation.isPending} className="gap-2">
                      <Plus className="w-4 h-4" />
                      {createProductMutation.isPending ? "Toevoegen..." : "Product Toevoegen"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Management Tab */}
          <TabsContent value="stock" className="space-y-4">
            <div className="grid gap-4">
              {products.map((product: Product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">€{product.price}</p>
                        <Badge variant={product.stock < 5 ? "destructive" : "default"}>
                          {product.stock}/{product.maxStock} beschikbaar
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingProduct === product.id ? (
                          <div className="space-y-4 w-full">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Naam</Label>
                                <Input
                                  value={editProductData?.name || product.name}
                                  onChange={(e) => setEditProductData({...editProductData, name: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Prijs (€)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editProductData?.price || product.price}
                                  onChange={(e) => setEditProductData({...editProductData, price: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Voorraad</Label>
                                <Input
                                  type="number"
                                  value={editProductData?.stock ?? product.stock}
                                  onChange={(e) => setEditProductData({...editProductData, stock: parseInt(e.target.value)})}
                                />
                              </div>
                              <div>
                                <Label>Max Voorraad</Label>
                                <Input
                                  type="number"
                                  value={editProductData?.maxStock ?? product.maxStock}
                                  onChange={(e) => setEditProductData({...editProductData, maxStock: parseInt(e.target.value)})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Beschrijving</Label>
                              <Textarea
                                value={editProductData?.description || product.description}
                                onChange={(e) => setEditProductData({...editProductData, description: e.target.value})}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label>Badges</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {availableBadges.map((badge) => (
                                  <div
                                    key={badge}
                                    onClick={() => {
                                      const currentBadges = editProductData?.badges || product.badges || [];
                                      const isSelected = currentBadges.includes(badge);
                                      if (isSelected) {
                                        setEditProductData({
                                          ...editProductData,
                                          badges: currentBadges.filter(b => b !== badge)
                                        });
                                      } else {
                                        setEditProductData({
                                          ...editProductData,
                                          badges: [...currentBadges, badge]
                                        });
                                      }
                                    }}
                                    className={`cursor-pointer px-3 py-1 rounded-full text-sm transition-colors ${
                                      (editProductData?.badges || product.badges || []).includes(badge)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                                    }`}
                                  >
                                    {badge}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Input
                                  placeholder="Nieuwe badge"
                                  value={newBadge}
                                  onChange={(e) => setNewBadge(e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (newBadge.trim() && !availableBadges.includes(newBadge.trim())) {
                                      setAvailableBadges([...availableBadges, newBadge.trim()]);
                                      setNewBadge("");
                                    }
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {availableBadges.map((badge) => (
                                  <div key={badge} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                    {badge}
                                    <button
                                      onClick={() => setAvailableBadges(availableBadges.filter(b => b !== badge))}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateProductMutation.mutate({...product, ...editProductData});
                                }}
                                className="gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Opslaan
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(null);
                                  setEditProductData(null);
                                }}
                              >
                                <X className="w-4 h-4" />
                                Annuleren
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(product.id);
                                setEditProductData(product);
                              }}
                              className="gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Bewerk
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Verwijder
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ramen Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-4">
              {ramenOrders.map((order: RamenOrder) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{order.customerName}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{order.customerEmail}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.selectedDate).toLocaleDateString('nl-NL')} - {order.quantity} porties
                        </p>
                        {order.notes && (
                          <p className="text-sm text-gray-600 mt-1">Opmerking: {order.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === "pending" ? "secondary" : order.status === "confirmed" ? "default" : "destructive"}>
                          {order.status === "pending" && "In behandeling"}
                          {order.status === "confirmed" && "Bevestigd"}
                          {order.status === "cancelled" && "Geannuleerd"}
                        </Badge>
                        <Select
                          value={order.status}
                          onValueChange={(status) => updateOrderStatusMutation.mutate({ id: order.id, status })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">In behandeling</SelectItem>
                            <SelectItem value="confirmed">Bevestigd</SelectItem>
                            <SelectItem value="cancelled">Geannuleerd</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}