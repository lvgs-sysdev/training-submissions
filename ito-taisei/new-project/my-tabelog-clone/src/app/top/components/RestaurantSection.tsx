// レストランセクションコンポーネント
import RestaurantCard from '../../../shared/components/card/RestaurantCard';
import type { RestaurantData } from '@/shared/utils/restaurantResponse';

interface RestaurantSectionProps {
  title: string;
  restaurants: RestaurantData[];
  emptyMessage: string;
  minHeight?: string;
}

const RestaurantSection: React.FC<RestaurantSectionProps> = ({ title, restaurants, emptyMessage, minHeight }) => {
  return (
    <section className="flex flex-col items-center w-full">
      <h2 className="text-xl font-bold mb-2 text-gray-700">{title}</h2>
      {restaurants.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full ${minHeight ?? ''} justify-items-center`}>
          {restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              name={r.name}
              address={r.address}
              imageUrl={r.image_url}
              genre={r.genre}
              station={r.station}
              averageRating={r.average_rating}
              opening_hours={r.opening_hours}
              link={r.link}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">{emptyMessage}</p>
      )}
    </section>
  );
};

export default RestaurantSection;
