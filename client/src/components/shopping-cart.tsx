import { useState, useEffect } from "react";
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
}

export const cartService = {
  items: [] as CartItem[],
  listeners: [] as (() => void)[],

  addItem: (product: Product) => {
    console.log("CART DEBUG: Adding product:", product);
    console.log("CART DEBUG: Current cart items:", cartService.items.length);
    
    if (!product) {
      console.error("CART ERROR: Product is null/undefined");
      return false;
    }
    
    if (!product.id) {
      console.error("CART ERROR: Product missing ID:", product);
      return false;
    }
    
    const existingItem = cartService.items.find(item => item.product?.id === product.id);
    if (existingItem) {
      console.log("CART DEBUG: Product already in cart, increasing quantity");
      existingItem.quantity += 1;
      cartService.notifyListeners();
      return true;
    }
    
    cartService.items.push({ product, quantity: 1 });
    console.log("CART DEBUG: Added new item, cart now has:", cartService.items.length, "items");
    cartService.notifyListeners();
    return true;
  },

  removeItem: (productId: number) => {
    cartService.items = cartService.items.filter(item => item.product.id !== productId);
    cartService.notifyListeners();
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      cartService.removeItem(productId);
      return;
    }
    const item = cartService.items.find(item => item.product.id === productId);
    if (item && quantity <= 1) { // Max 1 per product
      item.quantity = quantity;
      cartService.notifyListeners();
    }
  },

  clear: () => {
    cartService.items = [];
    cartService.notifyListeners();
  },

  getTotalPrice: () => {
    return cartService.items.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  },

  getItemCount: () => {
    return cartService.items.reduce((total, item) => total + item.quantity, 0);
  },

  subscribe: (listener: () => void) => {
    cartService.listeners.push(listener);
    return () => {
      cartService.listeners = cartService.listeners.filter(l => l !== listener);
    };
  },

  notifyListeners: () => {
    cartService.listeners.forEach(listener => listener());
  }
};

export function useShoppingCart() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = cartService.subscribe(() => {
      forceUpdate(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  return {
    items: cartService.items,
    addItem: cartService.addItem,
    removeItem: cartService.removeItem,
    updateQuantity: cartService.updateQuantity,
    clear: cartService.clear,
    totalPrice: cartService.getTotalPrice(),
    itemCount: cartService.getItemCount()
  };
}

export function ShoppingCart() {
  const { items, removeItem, updateQuantity, totalPrice, clear } = useShoppingCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const handleCheckout = () => {
    // Simulate checkout
    clear();
    setShowCheckout(false);
    toast({
      title: "Bestelling geplaatst!",
      description: "Je bestelling is succesvol geplaatst.",
    });
  };

  if (showCheckout) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Afrekenen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Naam</Label>
            <Input id="name" placeholder="Je naam" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="je@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoon</Label>
            <Input id="phone" placeholder="06-12345678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Opmerkingen</Label>
            <Textarea id="notes" placeholder="Bijzondere wensen..." />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
              Terug
            </Button>
            <Button onClick={handleCheckout} className="flex-1">
              Bestellen ({formatPrice(totalPrice.toFixed(2))})
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCartIcon className="h-5 w-5" />
          Winkelwagen ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCartIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Je winkelwagen is leeg</p>
            <p className="text-sm text-gray-400 mt-2">Voeg producten toe om te beginnen</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.filter(item => item.product && item.product.id).map((item) => (
              <div key={`cart-item-${item.product.id}`} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">€{item.product.price}</p>
                  <Badge variant="secondary" className="mt-1">
                    Aantal: {item.quantity}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= 1} // Max 1 per product
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(item.product.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Totaal:</span>
                <span>{formatPrice(totalPrice.toFixed(2))}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={clear} className="flex-1">
                  Leegmaken
                </Button>
                <Button onClick={() => setShowCheckout(true)} className="flex-1">
                  Afrekenen
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useShoppingCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const success = addItem(product);
    if (success) {
      toast({
        title: "Toegevoegd aan winkelwagen",
        description: `${product.name} is toegevoegd aan je winkelwagen.`,
      });
    } else {
      toast({
        title: "Al in winkelwagen",
        description: "Dit product zit al in je winkelwagen. Maximum 1 per persoon.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      className="w-full"
      size="lg"
    >
      {product.stock === 0 ? "Uitverkocht" : "Toevoegen aan winkelwagen"}
    </Button>
  );
}

export function CartButton() {
  const { items } = useShoppingCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Check admin status from server
  const { data: adminStatus } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
  });

  useEffect(() => {
    setIsAdmin(adminStatus?.isAdmin || false);
  }, [adminStatus]);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/admin/logout');
      setIsAdmin(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <ShoppingCartIcon className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
      
      {isAdmin && (
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="ml-2 text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Uitloggen
        </Button>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Winkelwagen</DialogTitle>
          </DialogHeader>
          <ShoppingCart />
        </DialogContent>
      </Dialog>
    </>
  );
}