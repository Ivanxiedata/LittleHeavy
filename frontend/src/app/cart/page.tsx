"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
}

interface Cart {
  id: number;
  items: CartItem[];
}

// In a real app, we would fetch product details for each item
// For this demo, we'll use the mock data from the main page or fetch it
const MOCK_PRODUCTS: Record<number, any> = {
  1: { name: "Winter Cardinal Pop-Up Card", price: 13.00, image_url: "https://images.unsplash.com/photo-1473187983305-f615310e7daa?q=80&w=800&auto=format&fit=crop" },
  2: { name: "Snowy Owl Pop-Up Bouquet", price: 26.00, image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop" },
  3: { name: "Holiday Train Pop-Up Card", price: 15.00, image_url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop" },
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/v1/cart", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/v1/checkout/create-session", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your cart is empty</h2>
        <p className="mt-4 text-gray-500">
          Start shopping to add items to your cart.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const product = MOCK_PRODUCTS[item.product_id];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
        
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section className="lg:col-span-7">
            <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {cart.items.map((item) => {
                const product = MOCK_PRODUCTS[item.product_id];
                if (!product) return null;

                return (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48 overflow-hidden">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link href={`/products/${item.product_id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label htmlFor={`quantity-${item.id}`} className="sr-only">
                            Quantity, {product.name}
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            name={`quantity-${item.id}`}
                            value={item.quantity}
                            disabled
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm"
                          >
                            <option value={item.quantity}>{item.quantity}</option>
                          </select>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-md border border-transparent bg-red-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
