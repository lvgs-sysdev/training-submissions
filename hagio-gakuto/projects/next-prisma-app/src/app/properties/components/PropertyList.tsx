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
  return (
    <div
      key={property.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-140 overflow-auto"
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
        {property.propertyType.name}&nbsp;{property.areaSqm.toString()}㎡/
        {property.layout.name}
      </p>
      <p className="text-gray-600 mt-2">
        {property.nearestStation} 徒歩{property.walkToStation}分
      </p>

      <p className="text-gray-600 mt-2">
        &#12306;{property.zip}
        <br />
        {property.city}
        {property.chome}丁目
        {property.block}番地
        {property?.building}
        {property?.roomNumber && <>{property?.roomNumber}号室</>}
      </p>

      <p className="text-lg font-bold text-gray-900 mt-4">
        ￥{property.priceRent}円
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
