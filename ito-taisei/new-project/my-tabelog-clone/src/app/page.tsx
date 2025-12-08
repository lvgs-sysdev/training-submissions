// TOP画面
import { Suspense } from "react";

import SearchArea from "./_components/SearchArea";
import PopularArea from "./_components/PopularArea";
import NewArrivalsArea from "./_components/NewArrivalsArea";
import RestaurantSection from '@/shared/components/RestaurantSection';
import SearchForm from '@/shared/components/SearchForm';
import SectionSkeleton from '@/shared/components/SectionSkeleton';

const SECTION_TITLES = {
  popular: "Popular Genres",
  newArrivals: "New Arrivals",
};

export default async function HomePage() {
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
        <Suspense fallback={<SectionSkeleton title={SECTION_TITLES.popular} />}>
          <PopularArea title={SECTION_TITLES.popular} />
        </Suspense>
        {/* New Arrivalsエリア */}
        <Suspense fallback={<SectionSkeleton title={SECTION_TITLES.newArrivals} />}>
          <NewArrivalsArea title={SECTION_TITLES.newArrivals} />
        </Suspense>
      </div>
    </main>
  );
}
