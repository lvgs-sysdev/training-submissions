"use client";

import { Property } from "@/types/PropertyType";
import { useEffect, useState, useCallback } from "react";
import { useLoading } from "@/context/LoadingContext";
import PropertyList from "../../components/PropertyList";
import InquiryButton from "../../components/InquiryButton";

export default function FavoriteProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [withinNeighborhood, setWithinNeighborhood] = useState<boolean>(true);
  const limit = 9; // ページあたりの物件数
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
      };

      const query = new URLSearchParams(params as any).toString();

      const response = await fetch(`/api/properties/favorite?${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const result = await response.json();
      // ★ オブジェクト形式のレスポンスを正しく受け取る

      setProperties(result.properties);
      setCount(result.count);
    } catch {
      setProperties([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset, withinNeighborhood, sortBy, setIsLoading]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleNextPage = () => {
    // 次のページがあればoffsetを更新
    if (offset + limit < count) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    // 前のページがあればoffsetを更新
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  return (
    <div className="font-sans container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold light:text-gray-900">
          お気に入り一覧
        </h1>
      </div>

      <div className="flex justify-between items-center mb-8">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={withinNeighborhood}
            className="sr-only peer"
            readOnly
            onClick={() => setWithinNeighborhood(!withinNeighborhood)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            ご近所手当範囲内のみを表示
          </span>
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-2"
        >
          <option value="price_asc">家賃が安い順</option>
          <option value="price_desc">家賃が高い順</option>
          <option value="area_desc">面積が広い順</option>
          <option value="age_asc">築年数が新しい順</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyList key={property.id} property={property} />
        ))}
      </div>

      {/* ★ ページング */}
      <div className="flex justify-center items-center mt-12 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={offset === 0}
          className={`px-4 py-2 bg-gray-200 rounded disabled:opacity-50 ${
            offset === 0
              ? "cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-300"
          }`}
        >
          前へ
        </button>
        <span>
          {Math.floor(offset / limit) + 1} / {Math.ceil(count / limit)} ページ
        </span>
        <button
          onClick={handleNextPage}
          disabled={offset + limit >= count}
          className={`px-4 py-2 bg-gray-200 rounded disabled:opacity-50 ${
            offset + limit >= count
              ? "cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-300"
          }`}
        >
          次へ
        </button>
      </div>
      <InquiryButton properties={properties} />
    </div>
  );
}
