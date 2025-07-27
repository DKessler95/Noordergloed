import { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple cart state management (in a real app, you'd use Context or a state management library)
let cartItems: CartItem[] = [];
let cartListeners: (() => void)[] = [];

export const cart = {
  getItems: () => cartItems,
  addItem: (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      // Maximum 1 per person - don't increase if already in cart
      return;
    }
    cartItems.push({ product, quantity: 1 });
    cartListeners.forEach(listener => listener());
  },
  removeItem: (productId: number) => {
    cartItems = cartItems.filter(item => item.product.id !== productId);
    cartListeners.forEach(listener => listener());
  },
  updateQuantity: (productId: number, quantity: number) => {
    // For kombucha products, max quantity is 1
    if (quantity > 1) quantity = 1;
    if (quantity <= 0) {
      cart.removeItem(productId);
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

export function useCart() {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const unsubscribe = cart.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return {
    items: cart.getItems(),
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    clear: cart.clear,
    totalPrice: cart.getTotalPrice(),
    itemCount: cart.getItemCount()
  };
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, totalPrice, clear } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Winkelwagen
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center py-8">
              <div>
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Je winkelwagen is leeg</p>
                <p className="text-sm text-gray-400 mt-2">Voeg producten toe om te beginnen</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg">
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
                        disabled={item.quantity >= 1} // Max 1 per person
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Totaal:</span>
                  <span>{formatPrice(totalPrice.toFixed(2))}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clear} className="flex-1">
                    Leegmaken
                  </Button>
                  <Button className="flex-1" onClick={onClose}>
                    Afrekenen
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <ShoppingCart className="w-4 h-4" />
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </Button>
      <Cart isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}