// 人気のジャンルのレストランデータを取得してRestaurantSectionに渡す
import { getPopularGenreRestaurants } from '@/shared/api/popularGenre';
import RestaurantSection from '@/shared/components/RestaurantSection';

interface PopularAreaProps {
  title: string;
}

export default async function PopularArea({ title }: PopularAreaProps) {
  const restaurants = await getPopularGenreRestaurants();

  return (
    <RestaurantSection
      title={title}
      restaurants={restaurants}
      emptyMessage="No restaurants for popular genres yet"
      minHeight="min-h-56"
    />
  );
}
