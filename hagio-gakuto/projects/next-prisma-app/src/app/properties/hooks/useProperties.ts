"use client";

import { useState, useCallback, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import { UnitSummary } from "@/types/PropertyType";
import { SearchFilters } from "../components/PropertySearchForm";

interface UsePropertiesParams {
  apiEndpoint: string;
  initialFilters?: SearchFilters | null;
  limit?: number;
}

export function useProperties({
  apiEndpoint,
  initialFilters = null,
  limit = 9,
}: UsePropertiesParams) {
  const [properties, setProperties] = useState<UnitSummary[]>([]);
  const [withinNeighborhood, setWithinNeighborhood] = useState<boolean>(true);
  const [filters, setFilters] = useState<SearchFilters | null>(initialFilters);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState("price_asc");
  const { setIsLoading } = useLoading();

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        limit,
        offset,
        sortBy,
        withinNeighborhood,
        ...(filters || {}),
      };

      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value != null) {
          if (Array.isArray(value)) {
            value.forEach((item) => queryParams.append(key, String(item)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      }

      const response = await fetch(`${apiEndpoint}?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      setProperties(result.properties);
      setCount(result.count);
    } catch {
      setProperties([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    apiEndpoint,
    limit,
    offset,
    sortBy,
    withinNeighborhood,
    filters,
    setIsLoading,
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleNextPage = () => {
    if (offset + limit < count) setOffset(offset + limit);
  };

  const handlePrevPage = () => {
    if (offset - limit >= 0) setOffset(offset - limit);
  };

  const handleToggleNeighborhood = () => {
    setWithinNeighborhood((prev) => !prev);
    setOffset(0); // フィルター変更時は1ページ目に戻す
  };

  return {
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
  };
}
