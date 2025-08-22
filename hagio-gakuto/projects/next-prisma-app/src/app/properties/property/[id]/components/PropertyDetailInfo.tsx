"use client";

import Image from "next/image";
import { Property } from "@/types/PropertyType";
import MapIcon from "@mui/icons-material/Map";
import HomeIcon from "@mui/icons-material/Home";
import StyleIcon from "@mui/icons-material/Style";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import InquiryButton from "@/app/properties/components/InquiryButton";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";

export default function PropertyDetailInfo({
  property,
}: Readonly<{ property: Property }>) {
  const mapUrl = `https://www.google.com/maps?q=${property.location.lat},${property.location.lng}`;
  const [favorite, setFavorite] = useState(property?.isFavorite || false);
  const isInquiry = property?.isInquiry || false;
  const { setIsLoading } = useLoading();

  const postFavorite = async () => {
    setIsLoading(true);
    const response = await fetch("/api/property/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ propertyId: property.id }),
    });
    if (!response.ok) {
      setIsLoading(false);
      throw new Error("Failed to fetch");
    }
    setIsLoading(false);
  };

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    postFavorite();
  };

  return (
    <>
      <div className="flex justify-between items-center my-8">
        <h1 className="text-3xl font-bold light:text-gray-900">物件詳細</h1>
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
          {/* <div
            className={`p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 border flex ${
              isInquiry && "text-sky-500"
            }`}
          >
            <AttachEmailIcon />
          </div> */}
          <div className="p-2 bg-white/70 backdrop-blur-sm rounded-full border flex">
            <AttachEmailIcon
              className={`
                "text-gray-700"
                ${isInquiry && "text-sky-500"}`}
            />
          </div>
        </nav>
      </div>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* メイン画像 */}
        <div className="relative w-full h-auto md:h-96">
          <Image
            src={property.photos[0]}
            alt={property.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="p-6 md:p-8">
          {/* 物件名と家賃 */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-sky-600">
                {property.type}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {property.name}
              </h1>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <br />
              <p className="text-3xl font-bold">
                {property.price_rent.toLocaleString()}
                <span className="text-base font-medium ml-1">円/月</span>
              </p>
            </div>
          </div>

          {/* 住所と地図 */}
          <div className="mt-4 border-t pt-4">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-sky-700 transition-colors"
            >
              <MapIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>
                〒{property.address.zip} {property.address.prefecture}{" "}
                {property.address.city} {property.address.street}{" "}
                {property.address.block}
              </span>
            </a>
            <p className="ml-7 text-sm text-gray-500">
              {property.nearest_station}
            </p>
          </div>

          {/* 詳細情報 */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
            <div className="flex items-center">
              <HomeIcon className="h-6 w-6 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">間取り/面積</p>
                <p className="font-semibold">
                  {property.layout} / {property.area_sqm}㎡
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">築年数</p>
              <p className="font-semibold">{property.age_years}年</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">階数</p>
              <p className="font-semibold">
                {property.floor}階 / {property.total_floors}階建
              </p>
            </div>
          </div>

          {/* 間取り図 */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">間取り図</h3>
            <div className="relative w-full h-auto">
              <Image
                src={property.floor_plan_url}
                alt={`${property.name}の間取り図`}
                width={600}
                height={600}
                className="w-full h-auto rounded-lg border"
              />
            </div>
          </div>

          {/* 特徴タグ */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <StyleIcon className="h-5 w-5 mr-2 text-gray-400" />
              特徴・設備
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <span
                  key={feature}
                  className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        {isInquiry ? (
          <button className="fixed bottom-8 right-8 w-auto px-4 h-16 bg-sky-600 text-white rounded-full shadow-lg flex gap-1 items-center justify-center  hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-not-allowed">
            <AttachEmailIcon fontSize="medium" />
            お問い合わせ済み
          </button>
        ) : (
          <InquiryButton properties={property} />
        )}
      </div>
    </>
  );
}
