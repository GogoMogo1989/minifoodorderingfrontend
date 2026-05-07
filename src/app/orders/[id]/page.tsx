"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

type OrderDetails = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const orderId = params.id;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiRequest<OrderDetails>(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setOrder(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load order");
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 text-gray-600 shadow">
          Loading order...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-red-50 p-6 text-red-700 shadow">
          <p>{error}</p>

          <Link
            href="/restaurants"
            className="mt-4 inline-block text-sm font-medium text-red-900 underline"
          >
            Back to restaurants
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 text-gray-600 shadow">
          Order not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/restaurants" className="text-sm text-gray-700 underline">
            Back to restaurants
          </Link>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order details
              </h1>

              <p className="mt-2 text-sm text-gray-600">Order ID: {order.id}</p>

              <p className="mt-4 text-lg font-semibold text-gray-900">
                {order.restaurantName}
              </p>
            </div>

            <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
              {order.status}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Items</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.menuItemId}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {item.quantity} × {item.price} HUF
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    {item.lineTotal} HUF
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>{order.totalPrice} HUF</span>
          </div>
        </div>
      </div>
    </main>
  );
}
