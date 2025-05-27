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
            Onze Ambachtelijke Collectie
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Elke fles wordt met zorg bereid met ingrediënten uit de Groninger natuur. 
            Beperkte voorraad, onbeperkte smaak.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {syrupProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Additional products grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1464454709131-ffd692591ee5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Verse vlierbloesem" 
              className="w-full h-32 object-cover rounded-lg mb-4" 
            />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Verse Vlierbloesem</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Seizoensgebonden</p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Kookproces in de keuken" 
              className="w-full h-32 object-cover rounded-lg mb-4" 
            />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ambachtelijk Proces</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Handgemaakt</p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Lokale ingrediënten" 
              className="w-full h-32 object-cover rounded-lg mb-4" 
            />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lokale Ingrediënten</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">100% Gronings</p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Kwaliteitsingrediënten" 
              className="w-full h-32 object-cover rounded-lg mb-4" 
            />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Premium Kwaliteit</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Geen kunstmatige toevoegingen</p>
          </div>
        </div>
      </div>
    </section>
  );
}
