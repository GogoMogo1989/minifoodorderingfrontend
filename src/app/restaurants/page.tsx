"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

type Restaurant = {
  id: string;
  name: string;
  description?: string;
  address?: string;
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const data = await apiRequest<Restaurant[]>("/restaurants");
        setRestaurants(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load restaurants");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose a restaurant and view its menu.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              Register
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow">
            Loading restaurants...
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow">
            {error}
          </div>
        )}

        {!isLoading && !error && restaurants.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow">
            No restaurants found.
          </div>
        )}

        {!isLoading && !error && restaurants.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {restaurant.name}
                </h2>

                {restaurant.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {restaurant.description}
                  </p>
                )}

                {restaurant.address && (
                  <p className="mt-4 text-sm font-medium text-gray-800">
                    {restaurant.address}
                  </p>
                )}

                <p className="mt-5 text-sm font-medium text-gray-900 underline">
                  View menu
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
