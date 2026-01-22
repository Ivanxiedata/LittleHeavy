"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { CategoryNav } from "@/components/layout/CategoryNav";

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  discount_text?: string;
  is_new?: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Category Navigation */}
      <CategoryNav />

      {/* Featured Collection */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Winter Collection</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Discover our most loved pop-up cards and gifts for the season.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
