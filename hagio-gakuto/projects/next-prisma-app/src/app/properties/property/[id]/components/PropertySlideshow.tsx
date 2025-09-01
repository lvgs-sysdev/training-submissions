"use client";

import Image from "next/image";
import { useState } from "react";

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

interface Props {
  photos: string[];
  alt: string;
}
export default function PropertySlideshow({ photos, alt }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 画像がない、または1枚しかない場合はスライドショー機能を表示しない
  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-full h-auto md:h-96 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">画像がありません</span>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === photos.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full h-auto md:h-96 group">
      {/* --- 画像表示エリア --- */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <Image
          // keyを追加して画像を強制的に再レンダリングし、トランジションを適用
          key={currentIndex}
          src={photos[currentIndex]}
          alt={alt}
          fill
          priority
          className=" transition-transform duration-500 ease-in-out transform scale-100 group-hover:scale-105 object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* --- 操作ボタン (左右の矢印) --- */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-opacity-50"
            aria-label="前の画像へ"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-30 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-opacity-50"
            aria-label="次の画像へ"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      {/* --- インジケーター (ドット) --- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {photos.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === slideIndex
                ? "bg-sky-700"
                : "bg-white bg-opacity-40 hover:bg-opacity-70"
            }`}
            aria-label={`画像 ${slideIndex + 1} を表示`}
          />
        ))}
      </div>
    </div>
  );
}
