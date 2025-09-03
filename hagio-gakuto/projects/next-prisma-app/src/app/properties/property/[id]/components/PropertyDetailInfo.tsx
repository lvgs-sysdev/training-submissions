"use client";

import Image from "next/image";

import MapIcon from "@mui/icons-material/Map";
import HomeIcon from "@mui/icons-material/Home";
import StyleIcon from "@mui/icons-material/Style";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import InquiryButton from "@/app/properties/components/InquiryButton";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import PropertySlideshow from "./PropertySlideshow";
import { calculateBuildingAge, formatDateToYMD } from "@/utils/DateUtil";
import { UnitDetail } from "@/types/PropertyType";

export default function PropertyDetailInfo({
  property,
}: Readonly<{ property: UnitDetail }>) {
  const [favorite, setFavorite] = useState(property?.isFavorite || false);
  const [isInquiry, setIsInquiry] = useState(property?.isInquiry || false);
  const { setIsLoading } = useLoading();

  // 間取り図とそれ以外の画像に分離
  const floorPlanImage = property.allImages.find(
    (img) => img.category.name === "間取り図"
  );
  const slideshowImages = property.allImages.filter(
    (img) => img.category.name !== "間取り図"
  );

  const postFavorite = async () => {
    setIsLoading(true);
    const response = await fetch("/api/property/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: property.id }),
    });
    if (!response.ok) {
      // エラーハンドリングをここに記述
    }
    setIsLoading(false);
  };

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    postFavorite();
  };

  const handleChangeInquiry = () => {
    setIsInquiry(true);
  };

  return (
    <>
      <div className="flex justify-between items-center my-8">
        <h2 className="text-3xl font-bold light:text-gray-900">物件詳細</h2>
        <nav className="flex gap-8">
          <button
            onClick={handleToggleFavorite}
            className=" p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 cursor-pointer hover:scale-110 transition-all duration-200 focus:outline-none border"
            aria-label="お気に入りに追加"
          >
            {favorite ? (
              <FavoriteIcon className="text-red-500" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </button>
          <div className="p-2 bg-white/70 backdrop-blur-sm rounded-full border flex">
            <AttachEmailIcon
              className={isInquiry ? "text-sky-500" : "text-gray-700"}
            />
          </div>
        </nav>
      </div>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <PropertySlideshow
          photos={slideshowImages}
          alt={property.building.name}
        />
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {property.building.name}{" "}
                {property.roomNumber && `${property.roomNumber}号室`}
              </h1>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <br />
              <p className="text-3xl font-bold">
                {property.priceRent.toLocaleString()}
                <span className="text-base font-medium ml-1">円/月</span>
              </p>
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
            <MapIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>
              {property.building.address}
              {property.roomNumber && ` ${property.roomNumber}号室`}
            </span>
            <p className="ml-7 text-sm text-gray-500">
              {property.building.nearestStation}徒歩
              {property.building.walkToStation}分
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
            <div className="flex items-center">
              <HomeIcon className="h-6 w-6 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">間取り/面積</p>
                <p className="font-semibold">
                  {property.layout.name} / {property.areaSqm}㎡
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">築年数</p>
              <p className="font-semibold">
                {calculateBuildingAge(property.building.buildDate)} /{" "}
                {formatDateToYMD(property.building.buildDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">階数</p>
              <p className="font-semibold">
                {property.floor}階 / {property.building.totalFloors}階建
              </p>
            </div>
          </div>
          {floorPlanImage && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">間取り図</h3>
              <div className="relative w-full h-auto">
                <Image
                  src={floorPlanImage.imageUrl}
                  alt={`${property.building.name}の間取り図`}
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-lg border"
                />
              </div>
            </div>
          )}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <StyleIcon className="h-5 w-5 mr-2 text-gray-400" />
              特徴・設備
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <span
                  key={feature.id}
                  className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {feature.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        {isInquiry ? (
          <button className="fixed bottom-8 right-8 w-auto px-4 h-16 bg-sky-600 text-white rounded-full shadow-lg flex gap-1 items-center justify-center hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-not-allowed">
            <AttachEmailIcon fontSize="medium" />
            お問い合わせ済み
          </button>
        ) : (
          <InquiryButton properties={property} onSuccess={handleChangeInquiry}>
            <AttachEmailIcon fontSize="medium" />
            お問い合わせ
          </InquiryButton>
        )}
      </div>
    </>
  );
}
