import { useState, useEffect } from "react";
import { ShoppingCart as CartIcon, X, Plus, Minus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

// Simple cart state management
let cartItems: CartItem[] = [];
let cartListeners: (() => void)[] = [];

export const cartService = {
  getItems: () => cartItems,
  addItem: (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      // Max 1 per person for syrups
      return false;
    }
    cartItems.push({ product, quantity: 1 });
    cartListeners.forEach(listener => listener());
    return true;
  },
  removeItem: (productId: number) => {
    cartItems = cartItems.filter(item => item.product.id !== productId);
    cartListeners.forEach(listener => listener());
  },
  updateQuantity: (productId: number, quantity: number) => {
    // Max 1 per person for syrups
    if (quantity > 1) quantity = 1;
    if (quantity <= 0) {
      cartService.removeItem(productId);
      return;
    }
    const item = cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      cartListeners.forEach(listener => listener());
    }
  },
  clear: () => {
    cartItems = [];
    cartListeners.forEach(listener => listener());
  },
  subscribe: (listener: () => void) => {
    cartListeners.push(listener);
    return () => {
      cartListeners = cartListeners.filter(l => l !== listener);
    };
  },
  getTotalPrice: () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  },
  getItemCount: () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }
};

export function useShoppingCart() {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const unsubscribe = cartService.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return {
    items: cartService.getItems(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const { toast } = useToast();
  
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: ""
  });

  const handleCheckout = async () => {
    if (!checkoutForm.customerName || !checkoutForm.customerEmail) {
      toast({
        title: "Vereiste velden",
        description: "Vul je naam en e-mail in om door te gaan.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create orders for each item in cart
      for (const item of items) {
        const orderData = {
          customerName: checkoutForm.customerName,
          customerEmail: checkoutForm.customerEmail,
          customerPhone: checkoutForm.customerPhone || "",
          quantity: item.quantity,
          notes: checkoutForm.notes || "",
          productId: item.product.id,
          totalAmount: (parseFloat(item.product.price) * item.quantity).toFixed(2),
          orderType: "product"
        };

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error("Failed to place order");
        }
      }

      setOrderCompleted(true);
      clear();
      toast({
        title: "Bestelling geplaatst!",
        description: "Je bestelling is succesvol ontvangen. Je ontvangt binnenkort een bevestiging.",
      });
    } catch (error) {
      toast({
        title: "Fout bij bestellen",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Bestelling geplaatst!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Bedankt voor je bestelling. Je ontvangt binnenkort een bevestiging per e-mail.
          </p>
          <Button onClick={() => setOrderCompleted(false)} className="w-full">
            Nieuwe bestelling
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showCheckout) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Afrekenen
            <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Summary */}
          <div className="space-y-2">
            <h4 className="font-medium">Bestelling overzicht</h4>
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} x{item.quantity}</span>
                <span>{formatPrice((parseFloat(item.product.price) * item.quantity).toFixed(2))}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Totaal</span>
              <span>{formatPrice(totalPrice.toFixed(2))}</span>
            </div>
          </div>

          <Separator />

          {/* Checkout Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                value={checkoutForm.customerName}
                onChange={(e) => setCheckoutForm({...checkoutForm, customerName: e.target.value})}
                placeholder="Je volledige naam"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={checkoutForm.customerEmail}
                onChange={(e) => setCheckoutForm({...checkoutForm, customerEmail: e.target.value})}
                placeholder="je@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefoon</Label>
              <Input
                id="phone"
                value={checkoutForm.customerPhone}
                onChange={(e) => setCheckoutForm({...checkoutForm, customerPhone: e.target.value})}
                placeholder="06-12345678"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Opmerkingen</Label>
              <Textarea
                id="notes"
                value={checkoutForm.notes}
                onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                placeholder="Bijzondere wensen..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <Button 
            onClick={handleCheckout} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Bezig..." : `Bestelling plaatsen - ${formatPrice(totalPrice.toFixed(2))}`}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CartIcon className="w-5 h-5" />
          Winkelwagen ({items.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <CartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Je winkelwagen is leeg</p>
            <p className="text-sm text-gray-400 mt-2">Voeg producten toe om te beginnen</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatPrice(item.product.price)}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    Max 1 per persoon
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= 1}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
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