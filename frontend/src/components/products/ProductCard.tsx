"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  discount_text?: string;
  is_new?: boolean;
}

export const ProductCard = ({ product }: { product: ProductProps }) => {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/v1/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        })
      });

      if (res.ok) {
        alert("Added to cart!");
        router.refresh(); // Update cart count in header if we had one
      } else {
        alert("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-white border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="aspect-h-1 aspect-w-1 overflow-hidden bg-gray-200 group-hover:opacity-75 h-80 relative">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover object-center"
        />
        {product.discount_text && (
          <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 text-xs font-bold text-white">
            {product.discount_text}
          </div>
        )}
        {product.is_new && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow">
            NEW
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
          {product.original_price && (
            <p className="text-xs text-gray-500 line-through">${product.original_price.toFixed(2)}</p>
          )}
        </div>
        
        <button
          onClick={addToCart}
          disabled={adding}
          className="mt-4 w-full rounded-md bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 z-10 relative"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};
