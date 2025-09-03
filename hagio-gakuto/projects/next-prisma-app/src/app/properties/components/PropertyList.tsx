"use client";

import { UnitSummary } from "@/types/PropertyType";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { calculateBuildingAge, formatDateToYMD } from "@/utils/DateUtil";

export default function PropertyList({
  property,
}: Readonly<{ property: UnitSummary }>) {
  return (
    <div
      key={property.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-130 overflow-auto"
    >
      <Link
        href={`/properties/property/${property.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={property.thumbnailUrl || ""}
          alt={property.buildingName}
          width={300}
          height={200}
          priority
          className="w-full h-48 object-cover rounded-md"
        />
        <h2 className="text-xl font-semibold text-gray-800 underline">
          {property.buildingName}
          {property?.floor ? ` ${property.floor}階` : ""}
        </h2>
      </Link>
      <p className="text-gray-600 mt-2">
        {/* {property.propertyType.name}&nbsp; */}
        {property.areaSqm.toString()}㎡ / {property.layout}
      </p>
      <p className="text-gray-600 mt-2">
        {property.nearestStation} 徒歩{property.walkToStation}分
      </p>

      <p className="text-gray-600 mt-2">{property.address}</p>
      <p className="text-gray-600 mt-2">
        築 {calculateBuildingAge(property.buildDate)} /{" "}
        {formatDateToYMD(property.buildDate)}
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
