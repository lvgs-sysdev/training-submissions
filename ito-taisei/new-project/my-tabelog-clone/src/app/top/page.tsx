// TOP画面
import { Suspense } from "react";
import { getTopFeed } from "@/app/top/api/getTopFeed";
import SearchArea from "./components/SearchArea";
import RestaurantSection from "./components/RestaurantSection";

export default async function HomePage() {
  const { popular, newArrivals } = await getTopFeed();
  return (
    <main className="pt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* 検索エリア */}
        <section className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-center">🍜 Save Your Favorite Restaurants 🍜</h1>
          <Suspense fallback={<div className="h-12 w-full max-w-xl bg-gray-100 rounded animate-pulse" />}>
            <SearchArea />
          </Suspense>
        </section>
        {/* Popular Genresエリア */}
        <RestaurantSection
          title="Popular Genres"
          restaurants={popular}
          emptyMessage="No restaurants for popular genres yet"
          minHeight="min-h-56"
        />
        {/* New Arrivalsエリア */}
        <RestaurantSection
          title="New Arrivals"
          restaurants={newArrivals}
          emptyMessage="No new restaurants yet"
          minHeight="min-h-56"
        />
      </div>
    </main>
  );
}
