// 人気のジャンルのレストランデータを取得してRestaurantSectionに渡す
import RestaurantSection from '@/app/top/components/RestaurantSection';
import type { RestaurantData } from '@/shared/utils/restaurantResponse';

interface NewArrivalsAreaProps {
  restaurants: RestaurantData[];
}

export default function NewArrivalsArea({ restaurants }: NewArrivalsAreaProps) {

  return (
    <RestaurantSection
      title="New Arrivals"
      restaurants={restaurants}
      emptyMessage="No new restaurants yet"
      minHeight="min-h-56"
    />
  );
}
