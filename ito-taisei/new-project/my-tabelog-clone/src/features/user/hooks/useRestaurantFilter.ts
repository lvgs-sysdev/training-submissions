// 検索ワードやジャンルでの絞り込みロジックを提供するフック
import { useState, useMemo } from "react";
import { RestaurantData } from "@/shared/types/restaurant";

export const useRestaurantFilter = (restaurants: RestaurantData[]) => {
  const [keyword, setKeyword] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");

  // ジャンル一覧の生成
  const availableGenres = useMemo(() => {
    const genres = restaurants.map((r) => r.genre?.name).filter(Boolean);
    return Array.from(new Set(genres)) as string[];
  }, [restaurants]);

  // フィルタリング実行
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchKeyword =
        keyword === "" ||
        r.name.toLowerCase().includes(keyword.toLowerCase()) ||
        r.address.toLowerCase().includes(keyword.toLowerCase());
      const matchGenre =
        selectedGenre === "all" || r.genre?.name === selectedGenre;
      return matchKeyword && matchGenre;
    });
  }, [restaurants, keyword, selectedGenre]);

  return {
    keyword,
    setKeyword,
    selectedGenre,
    setSelectedGenre,
    availableGenres,
    filteredRestaurants,
  };
};
