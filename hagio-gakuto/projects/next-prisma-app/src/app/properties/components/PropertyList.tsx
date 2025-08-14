"use client";

import { Property } from "@/types/PropertyType";
import Image from "next/image";
import Link from "next/link";

export default function PropertyList({
  property,
}: Readonly<{ property: Property }>) {
  const mapUrl = `https://www.google.com/maps?q=${property.location.lat},${property.location.lng}`;
  return (
    <div
      key={property.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-120 overflow-auto"
    >
      <Link href={`/properties/property/${property.id}`}>
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
      <p className="text-gray-600 mt-2">{property.nearest_station}</p>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 mt-2 block hover:text-sky-600 hover:underline cursor-pointer"
      >
        <p className="text-gray-600 mt-2">
          &#12306;{property.address.zip}
          <br />
          {property.address.city}
          {property.address.street}
          {property.address.block}
        </p>
      </a>

      <p className="text-lg font-bold text-gray-900 mt-4">
        ￥{property.price_rent.toLocaleString()}円
      </p>
    </div>
  );
}
