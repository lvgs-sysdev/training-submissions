// レストラン情報コンポーネント
"use client";

import React from 'react';
import RestaurantInfoCard from '@/shared/components/card/RestaurantInfoCard';
import { RestaurantData } from '../types';

interface RestaurantInfoProps {
  restaurant: RestaurantData;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurant }) => {
  const distance = restaurant.distance
    ? `${Math.round(restaurant.distance)}m` 
    : null;

  const containerClass = "bg-white rounded-lg shadow p-4 border border-gray-200 block transition hover:shadow-md h-full";

  // 中身のコンテンツ
  const content = <RestaurantInfoCard restaurant={restaurant} distance={distance} />;

  if (restaurant.link) {
    return (
      <li className="list-none">
        <a 
          href={restaurant.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`${containerClass} cursor-pointer`}
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li className={`list-none ${containerClass}`}>
      {content}
    </li>
  );
};

export default RestaurantInfo;
