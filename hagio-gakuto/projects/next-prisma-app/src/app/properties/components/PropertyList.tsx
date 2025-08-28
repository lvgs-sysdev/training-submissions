"use client";

import { Property } from "@/types/PropertyType";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

export default function PropertyList({
  property,
}: Readonly<{ property: Property }>) {
  const mapUrl = `https://www.google.com/maps?q=${property.lat},${property.lng}`;

  return (
    <div
      key={property.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-120 overflow-auto"
    >
      <Link
        href={`/properties/property/${property.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={property.photos[0]}
          alt={property.name}
          width={300}
          height={200}
          priority
          className="w-full h-48 object-cover rounded-md"
        />
        <h2 className="text-xl font-semibold text-gray-800 underline">
          {property.name}
        </h2>
      </Link>
      <p className="text-gray-600 mt-2">
        {property.type}&nbsp;{property.area_sqm}㎡/{property.layout}
      </p>
      <p className="text-gray-600 mt-2">
        {property.nearest_station} 徒歩{property.walk_to_station}分
      </p>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 mt-2 block hover:text-sky-600 hover:underline cursor-pointer"
      >
        <p className="text-gray-600 mt-2">
          &#12306;{property.zip}
          <br />
          {property.city}
          {property.street}
          {property.block}
        </p>
      </a>

      <p className="text-lg font-bold text-gray-900 mt-4">
        ￥{property.price_rent.toLocaleString()}円
      </p>
      <div className="flex gap-4 justify-end">
        <div className=" p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-700   border">
          {property.isFavorite ? (
            <FavoriteIcon className="text-red-500" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </div>
        <div className="p-2 bg-white/70 backdrop-blur-sm rounded-full border flex">
          <AttachEmailIcon
            className={`
                "text-gray-700"
                ${property.isInquiry && "text-sky-500"}`}
          />
        </div>
      </div>
    </div>
  );
}
