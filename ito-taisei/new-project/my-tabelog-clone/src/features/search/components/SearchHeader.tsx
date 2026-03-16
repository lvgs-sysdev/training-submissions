// 検索結果ヘッダーコンポーネント
type Props = {
  genreName?: string;
  stationName?: string;
  resultCount?: number;
};

export default function SearchHeader({ genreName, stationName, resultCount = 0 }: Props) {
  // 条件が何もない場合の表示
  if (!genreName && !stationName) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">全件表示</h2>
        <p className="text-gray-600">
          <span className="font-bold">{resultCount.toLocaleString()}</span> 件
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 border-b pb-2 border-gray-200">
      <div className="flex items-end gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          {genreName && <span className="mr-3">ジャンル: {genreName}</span>}
          {stationName && <span>駅: {stationName}</span>}
        </h2>
        
        <span className="text-gray-600 text-sm mb-1">
          検索結果: <span className="font-bold text-lg text-[#d9534f]">{resultCount.toLocaleString()}</span> 件
        </span>
      </div>
    </div>
  );
}
