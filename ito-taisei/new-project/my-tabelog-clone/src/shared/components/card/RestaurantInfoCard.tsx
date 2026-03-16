// 検索画面用のレストランカードコンポーネント
"use client";

import React from 'react';
import Image from 'next/image';
import type { RestaurantData } from '@/shared/types/restaurant';

interface RestaurantInfoCardProps {
  restaurant: RestaurantData;
  distance: string | null;
}

const RestaurantInfoCard: React.FC<RestaurantInfoCardProps> = ({ restaurant, distance }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg">{restaurant.name}</span>
        {distance && (
          <span className="text-orange-600 font-bold text-sm whitespace-nowrap">現在地から: {distance}</span>
        )}
      </div>
      <div>住所: {restaurant.address}</div>
      <div className="flex flex-row gap-4 w-full mb-1 items-center mt-2">
        <div className="flex items-center gap-1">
          <span className="text-base text-black">ジャンル:</span>
          {restaurant.genre?.name && (
            <span className="text-xs bg-yellow-100 text-yellow-800 rounded px-2 py-1 w-fit">
              {restaurant.genre.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base text-black">エリア:</span>
          {restaurant.station?.name && (
            <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 w-fit">
              {restaurant.station.name}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <div>予算: {restaurant.budget ? `¥${restaurant.budget}` : '-'}</div>
        <div>営業時間: {restaurant.opening_hours ?? '-'}</div>
        <div>平均評価: ⭐ {restaurant.average_rating} ({restaurant.review_count}件)</div>
      </div>

      {restaurant.image_url && (
        <div className="mt-2 relative w-full h-[200px]">
          <Image
            src={restaurant.image_url}
            alt={restaurant.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
    </>
  );
};

export default RestaurantInfoCard;
