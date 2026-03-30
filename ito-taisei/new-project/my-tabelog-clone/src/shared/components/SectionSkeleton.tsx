import React from "react";

interface SectionSkeletonProps {
  title: string;
}

const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ title }) => (
  <section className="flex flex-col items-center w-full">
    <h2 className="text-xl font-bold mb-2 text-gray-700">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full justify-items-center">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="w-[360px] h-[420px] bg-white rounded-lg shadow p-4 flex flex-col items-center border border-gray-100"
        >
          {/* 画像領域 */}
          <div className="w-full bg-gray-200 rounded mb-2 animate-pulse" style={{ height: 200 }} />
          {/* タイトル領域 */}
          <div className="w-full h-7 bg-gray-200 rounded mb-1 animate-pulse self-start" />
          {/* 住所領域 */}
          <div className="w-full h-4 bg-gray-200 rounded mb-1 animate-pulse self-start" />
          {/* タグ・評価領域（ジャンル・駅・評価） */}
          <div className="flex items-center gap-2 w-full mb-1">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* 営業時間領域 */}
          <div className="w-full bg-gray-200 rounded mt-2 animate-pulse" style={{ maxHeight: '6em', height: '80px' }} />
        </div>
      ))}
    </div>
  </section>
);

export default SectionSkeleton;
