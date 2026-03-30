// ソートセレクトコンポーネント
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "created_at_desc";

  // 現在地のステート（距離順を選んだときに使う）
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // コンポーネントマウント時に現在地を取得しておく（距離順用）
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", newSort);
    params.set("page", "1");

    if (newSort === "distance" && location) {
      params.set("lat", location.lat.toString());
      params.set("lng", location.lng.toString());
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-[#d9534f]">Sort</h2>
      <select
        value={currentSort}
        onChange={handleChange}
        className="px-3 py-2 rounded border border-gray-300 w-full h-[42px] cursor-pointer"
      >
        <option value="created_at_desc">新着順</option>
        <option value="rating_desc">評価が高い順</option>
        <option value="review_desc">レビュー数が多い順</option>
        <option value="budget_asc">予算が安い順</option>
        <option value="budget_desc">予算が高い順</option>
        <option value="distance">距離順</option>
      </select>
    </div>
  );
}
