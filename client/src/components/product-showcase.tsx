import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";
import type { Product } from "@shared/schema";

export function ProductShowcase() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const syrupProducts = products?.filter(p => p.category === "syrup") || [];

  if (isLoading) {
    return (
      <section id="producten" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="producten" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Onze Collectie
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Elk product wordt met zorg bereid met ingrediënten uit en rond Groningen. 
            Beperkte voorraad, op aanvraag of gewoon zomaar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {syrupProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>


      </div>
    </section>
  );
}
