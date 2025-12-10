// 人気のジャンルのレストランデータを取得してRestaurantSectionに渡す
import RestaurantSection from '@/app/top/components/RestaurantSection';
import type { RestaurantData } from '@/shared/utils/restaurantResponse';

interface PopularAreaProps {
  restaurants: RestaurantData[];
}

export default function PopularArea({ restaurants }: PopularAreaProps) {

  return (
    <RestaurantSection
      title="Popular Genres"
      restaurants={restaurants}
      emptyMessage="No restaurants for popular genres yet"
      minHeight="min-h-56"
    />
  );
}
