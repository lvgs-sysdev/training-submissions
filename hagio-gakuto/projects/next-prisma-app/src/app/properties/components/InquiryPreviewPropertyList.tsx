"use client";

import { UnitDetail, UnitSummary } from "@/types/PropertyType";
import Image from "next/image";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  property: UnitSummary;
  onDelete: (id: number) => void;
}

export default function InquiryPreviewPropertyList({
  property,
  onDelete,
}: Readonly<Props>) {
  return (
    <div
      key={property.id}
      className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-auto  overflow-hidden m-2 relative"
    >
      <button
        type="button"
        aria-label="削除"
        onClick={() => onDelete(property.id)}
        className="absolute right-0 top-0 z-50 cursor-pointer rounded-xl bg-gray-400 p-1 text-white duration-200 hover:bg-gray-500 transition-colors"
      >
        <CloseIcon />
      </button>
      <Link
        href={`/properties/property/${property.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className=""
      >
        <div className="flex gap-1 items-center">
          <Image
            src={
              property.thumbnailUrl || "/images/placeholder.jpg" // thumbnailUrlがnullの場合の fallback
            }
            alt={property.buildingName}
            width={300}
            height={200}
            priority
            className="w-20 h-20 object-cover rounded-md"
          />
          <h2 className="text-base font-semibold text-gray-800 underline">
            {property.buildingName}
            {property?.floor ? ` ${property.floor}階` : ""}
          </h2>
        </div>
      </Link>
    </div>
  );
}
