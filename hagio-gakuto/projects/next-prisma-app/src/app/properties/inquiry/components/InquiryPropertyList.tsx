"use client";

import { useEffect } from "react";
import { useProperties } from "../../hooks/useProperties";
import PropertyListView from "../../components/PropertyListView";

export default function InquiryPropertiesPage() {
  const {
    properties,
    count,
    limit,
    offset,
    sortBy,
    withinNeighborhood,
    fetchProperties,
    setSortBy,
    handleNextPage,
    handlePrevPage,
    handleToggleNeighborhood,
  } = useProperties({ apiEndpoint: "/api/properties/inquiry" });

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

  return (
    <div className="font-sans container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold light:text-gray-900">
          お問い合わせ物件一覧
        </h1>
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
