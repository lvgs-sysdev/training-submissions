"use client";

import { useEffect } from "react";
import PropertySearchForm, { SearchFilters } from "./PropertySearchForm";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

import { useProperties } from "../hooks/useProperties";
import PropertyListView from "./PropertyListView";

export default function PropertySearchPage() {
  const {
    properties,
    count,
    limit,
    offset,
    sortBy,
    withinNeighborhood,
    fetchProperties,
    setSortBy,
    setFilters,
    handleNextPage,
    handlePrevPage,
    handleToggleNeighborhood,
  } = useProperties({ apiEndpoint: "/api/properties" });

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchProperties();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchProperties]);

  // PropertySearchFormから検索条件を受け取る関数
  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="font-sans container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold light:text-gray-900">物件一覧</h1>
        <nav className="flex gap-8">
          <Link
            href="/properties/favorite"
            className=" p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 cursor-pointer hover:scale-110 transition-all duration-200 focus:outline-none border flex "
            aria-label="お気に入り一覧"
          >
            <FavoriteIcon className="text-red-500" />
          </Link>
          <Link
            href="/properties/inquiry"
            className=" p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:text-sky-500 cursor-pointer hover:scale-110 transition-all duration-200 focus:outline-none border flex "
            aria-label="お問い合わせ一覧"
          >
            <AttachEmailIcon />
          </Link>
        </nav>
      </div>
      <div className="my-8">
        <PropertySearchForm onSearch={handleSearch} />
      </div>

      <PropertyListView
        properties={properties}
        count={count}
        limit={limit}
        offset={offset}
        sortBy={sortBy}
        withinNeighborhood={withinNeighborhood}
        setSortBy={setSortBy}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleToggleNeighborhood={handleToggleNeighborhood}
        onSuccess={fetchProperties}
      />
    </div>
  );
}
