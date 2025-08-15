"use client";

import { Property } from "@/types/PropertyType";
import { useEffect, useState, useCallback } from "react";
import PropertyList from "./PropertyList";
import { useLoading } from "@/context/LoadingContext";
import PropertySearchForm, { SearchFilters } from "./PropertySearchForm";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";

export default function PropertySearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [withinNeighborhood, setWithinNeighborhood] = useState<boolean>(true);
  const [filters, setFilters] = useState<SearchFilters | null>(null);
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
        // スプレッド構文でfiltersオブジェクトの中身を展開してマージ
        ...(filters || {}),
      };

      const query = new URLSearchParams(params as any).toString();

      const response = await fetch(`/api/properties?${query}`);
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
  }, [limit, offset, withinNeighborhood, sortBy, setIsLoading, filters]);

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

  // PropertySearchFormから検索条件を受け取る関数
  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="font-sans container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold light:text-gray-900">物件一覧</h1>
        <Link
          href="/properties/favorite"
          className=" p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 cursor-pointer hover:scale-110 transition-all duration-200 focus:outline-none border"
          aria-label="お気に入り一覧"
        >
          <FavoriteIcon className="text-red-500" />
        </Link>
      </div>
      <div className="my-8">
        <PropertySearchForm onSearch={handleSearch} />
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
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-green-600"></div>
          <span className="ms-3 text-sm font-medium">
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

      {/* ★ ページングUIを追加 */}
      <div className="flex justify-center items-center mt-12 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={offset === 0}
          className={`px-4 py-2 bg-sky-600 rounded disabled:opacity-50 text-white ${
            offset === 0
              ? "cursor-not-allowed"
              : "cursor-pointer hover:bg-sky-300"
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
          className={`px-4 py-2 bg-sky-600 rounded disabled:opacity-50 text-white ${
            offset + limit >= count
              ? "cursor-not-allowed"
              : "cursor-pointer hover:bg-sky-300"
          }`}
        >
          次へ
        </button>
      </div>
    </div>
  );
}
