import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StockIndicator } from "./stock-indicator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const orderMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/orders/syrup", {
        customerName: "Demo Customer",
        customerEmail: "demo@example.com",
        customerPhone: "06-12345678",
        productId: product.id,
        quantity: 1,
        totalAmount: product.price,
      });
    },
    onSuccess: () => {
      toast({
        title: "Bestelling geplaatst!",
        description: `${product.name} is toegevoegd aan je bestelling.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    },
  });

  const isElderflower = product.name.includes("Vlierbloesem");
  const isRose = product.name.includes("Rozen");
  
  const gradientClass = isElderflower 
    ? "from-yellow-50 to-yellow-100 dark:from-gray-700 dark:to-gray-600"
    : isRose 
    ? "from-pink-50 to-pink-100 dark:from-gray-700 dark:to-gray-600"
    : "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600";
    
  const badgeClass = isElderflower
    ? "bg-yellow-200 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100"
    : isRose
    ? "bg-pink-200 dark:bg-pink-600 text-pink-800 dark:text-pink-100"
    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100";
    
  const priceClass = isElderflower
    ? "text-yellow-600 dark:text-yellow-400"
    : isRose
    ? "text-pink-600 dark:text-pink-400"
    : "text-purple-600 dark:text-purple-400";
    
  const buttonClass = isElderflower
    ? "bg-yellow-600 hover:bg-yellow-700"
    : isRose
    ? "bg-pink-600 hover:bg-pink-700"
    : "bg-purple-600 hover:bg-purple-700";

  return (
    <div className="group h-full">
      <div className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-105 h-full flex flex-col`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <Badge className={`${badgeClass} mb-4`}>
              {isElderflower ? "Seizoensspecialiteit" : isRose ? "Huistuin Delicatesse" : "Premium"}
            </Badge>
            
            <h3 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>
            
            <div className="space-y-4">
              <StockIndicator 
                current={product.stock} 
                max={product.maxStock}
                productName={product.name}
              />

              <div className="flex items-center justify-between">
                <span className={`font-display text-3xl font-bold ${priceClass}`}>
                  €{product.price}
                </span>
                <Button
                  onClick={() => window.location.href = `/producten/${product.name === "Vlierbloesem Siroop" ? "vlierbloesem-siroop" : "rozen-siroop"}`}
                  disabled={product.stock === 0}
                  className={`${buttonClass} text-white px-6 py-3 rounded-xl font-semibold transition-colors transform hover:scale-105`}
                >
                  {product.stock === 0 ? "Uitverkocht" : "Bekijk Product"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={product.imageUrl || "/images/voorkant-siroop.png"} 
                alt={`${product.name} voorkant`} 
                className="w-full h-auto rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500" 
              />
              <img 
                src="/images/achterkant-siroop.png" 
                alt={`${product.name} achterkant`} 
                className="w-full h-auto rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
