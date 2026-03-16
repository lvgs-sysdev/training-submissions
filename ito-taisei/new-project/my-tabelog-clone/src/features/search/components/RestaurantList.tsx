// レストランリストコンポーネント
import RestaurantInfo from "./RestaurantInfo";
import type { RestaurantData } from "../types";

interface RestaurantListProps {
  restaurants: RestaurantData[];
}

export default function RestaurantList({ restaurants }: RestaurantListProps) {
  // データが0件の場合
  if (restaurants.length === 0) {
    return <div className="text-gray-500 mt-4">条件に一致するお店が見つかりませんでした。</div>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {restaurants.map((r) => (
        <RestaurantInfo key={r.id} restaurant={r} />
      ))}
    </ul>
  );
}
