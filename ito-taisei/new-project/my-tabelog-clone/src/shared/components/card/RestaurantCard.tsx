// レストランカードコンポーネント
"use client";

import React from 'react';

export type RestaurantCardProps = {
  name: string;
  address: string;
  imageUrl?: string;
  genre?: string;
	station?: string;
  averageRating?: number;
  opening_hours?: string;
  link?: string;
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({ name, address, imageUrl, genre, station, averageRating, opening_hours, link }) => {
  const cardContent = (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center transition-shadow duration-200 w-[360px] h-[420px]">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full object-cover rounded mb-2" style={{ height: 200 }} />
      ) : (
        <div className="w-full flex items-center justify-center bg-gray-200 rounded mb-2 text-gray-400" style={{ height: 200 }}>
          No Image
        </div>
      )}
      <h3 className="text-lg font-bold mb-1 w-full truncate">{name}</h3>
      <p className="text-sm text-gray-600 mb-1 w-full truncate">{address}</p>
      <div className="flex items-center gap-2 w-full">
        {genre && <span className="text-xs bg-yellow-100 text-yellow-800 rounded px-2 py-1 mb-1">{genre}</span>}
				{station && <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 mb-1">{station}</span>}
        {averageRating !== undefined && (
          <span className="text-xs text-gray-500">⭐ {averageRating.toFixed(1)}</span>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2 w-full break-words overflow-hidden" style={{ maxHeight: '6em', whiteSpace: 'pre-line' }}>{opening_hours}</p>
    </div>
  );

  return link ? (
    <div className="w-[360px] h-[420px]">
      <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {cardContent}
      </a>
    </div>
  ) : cardContent;
};

export default RestaurantCard;
