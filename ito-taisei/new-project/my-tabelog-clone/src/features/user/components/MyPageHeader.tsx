import React from "react";

type Props = {
  restaurantCount: number;
  keyword: string;
  setKeyword: (value: string) => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  availableGenres: string[];
  onOpenModal: () => void;
};

export const MyPageHeader = ({
  restaurantCount,
  keyword,
  setKeyword,
  selectedGenre,
  setSelectedGenre,
  availableGenres,
  onOpenModal,
}: Props) => {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b shadow-sm h-16">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* 左側：件数 */}
        <div className="text-sm font-medium text-gray-500">
          <span className="text-gray-900 font-bold text-lg">{restaurantCount}</span>
          <span className="text-xs ml-1">件</span>
        </div>

        {/* 右側：操作エリア */}
        <div className="flex flex-1 justify-end items-center gap-2">
          {/* 検索窓 */}
          <div className="relative w-full max-w-[200px] md:max-w-[240px] transition-all">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="店名・エリア..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full border border-gray-300 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition shadow-sm"
            />
          </div>

          {/* ジャンル選択 */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="hidden sm:block border border-gray-300 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm hover:bg-gray-50"
          >
            <option value="all">すべて</option>
            {availableGenres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* 追加ボタン */}
          <button
            onClick={onOpenModal}
            className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2.5 rounded-full shadow-md transition flex-shrink-0 active:scale-95"
            title="新規追加"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
