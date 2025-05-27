import { AlertTriangle } from "lucide-react";

interface StockIndicatorProps {
  current: number;
  max: number;
  productName: string;
}

export function StockIndicator({ current, max, productName }: StockIndicatorProps) {
  const percentage = (current / max) * 100;
  const isLowStock = current <= 5;
  
  const getStockColor = () => {
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (productName?.includes("Vlierbloesem")) return "text-yellow-600 dark:text-yellow-400";
    if (productName?.includes("Rozen")) return "text-pink-600 dark:text-pink-400";
    return "text-purple-600 dark:text-purple-400";
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Voorraad</span>
        <span className={`text-sm font-semibold ${getTextColor()}`}>
          {current}/{max} beschikbaar
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${getStockColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isLowStock && current > 0 && (
        <div className="flex items-center mt-1">
          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400 mr-1" />
          <span className="text-xs text-red-600 dark:text-red-400">Beperkte voorraad</span>
        </div>
      )}
      
      {current === 0 && (
        <div className="flex items-center mt-1">
          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400 mr-1" />
          <span className="text-xs text-red-600 dark:text-red-400">Uitverkocht</span>
        </div>
      )}
    </div>
  );
}
