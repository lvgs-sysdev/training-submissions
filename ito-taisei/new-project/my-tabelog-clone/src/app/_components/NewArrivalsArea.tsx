// 人気のジャンルのレストランデータを取得してRestaurantSectionに渡す
import { getNewArrivals } from '@/shared/api/newArrivals';
import RestaurantSection from '@/shared/components/RestaurantSection';

interface NewArrivalsAreaProps {
  title: string;
}

export default async function NewArrivalsArea({ title }: NewArrivalsAreaProps) {
  const restaurants = await getNewArrivals();

  return (
    <RestaurantSection
      title={title}
      restaurants={restaurants}
      emptyMessage="No new restaurants yet"
      minHeight="min-h-56"
    />
  );
}
