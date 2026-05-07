"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

type RestaurantDetails = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  menu: MenuItem[];
};

type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

type CreateOrderResponse = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  totalPrice: number;
  status: string;
};

export default function RestaurantDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const restaurantId = params.id;

  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const data = await apiRequest<RestaurantDetails>(
          `/restaurants/${restaurantId}`,
        );

        setRestaurant(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load restaurant");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  function addToCart(menuItem: MenuItem) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.menuItemId === menuItem.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.menuItemId === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
  }

  function decreaseQuantity(menuItemId: string) {
    setCartItems((currentItems) => {
      return currentItems
        .map((item) =>
          item.menuItemId === menuItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0);
    });
  }

  function increaseQuantity(menuItemId: string) {
    setCartItems((currentItems) => {
      return currentItems.map((item) =>
        item.menuItemId === menuItemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    });
  }

  async function placeOrder() {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (!restaurant || cartItems.length === 0) {
      return;
    }

    setError("");
    setIsPlacingOrder(true);

    try {
      const order = await apiRequest<CreateOrderResponse>("/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          items: cartItems.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        }),
      });

      router.push(`/orders/${order.id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to place order");
      }
    } finally {
      setIsPlacingOrder(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 text-gray-600 shadow">
          Loading restaurant...
        </div>
      </main>
    );
  }

  if (error && !restaurant) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-red-50 p-6 text-red-700 shadow">
          {error}
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 text-gray-600 shadow">
          Restaurant not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/restaurants" className="text-sm text-gray-700 underline">
            Back to restaurants
          </Link>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            {restaurant.name}
          </h1>

          {restaurant.description && (
            <p className="mt-2 text-gray-600">{restaurant.description}</p>
          )}

          {restaurant.address && (
            <p className="mt-4 text-sm font-medium text-gray-800">
              {restaurant.address}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Menu</h2>

            <div className="space-y-4">
              {restaurant.menu.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-5 shadow">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-3 font-medium text-gray-900">
                        {item.price} HUF
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">Cart</h2>

            {cartItems.length === 0 && (
              <p className="mt-4 text-sm text-gray-600">Your cart is empty.</p>
            )}

            {cartItems.length > 0 && (
              <div className="mt-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.price} HUF each
                        </p>
                      </div>

                      <p className="font-medium text-gray-900">
                        {item.price * item.quantity} HUF
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.menuItemId)}
                        className="h-8 w-8 rounded-lg border border-gray-300 text-gray-900"
                      >
                        -
                      </button>

                      <span className="min-w-6 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.menuItemId)}
                        className="h-8 w-8 rounded-lg border border-gray-300 text-gray-900"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{totalPrice} HUF</span>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={isPlacingOrder}
                  className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                >
                  {isPlacingOrder ? "Placing order..." : "Place Order"}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
