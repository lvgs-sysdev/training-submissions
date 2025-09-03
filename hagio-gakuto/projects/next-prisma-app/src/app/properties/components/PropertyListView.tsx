"use client";

import PropertyList from "./PropertyList";
import InquiryButton from "./InquiryButton";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { UnitSummary } from "@/types/PropertyType";

interface PropertyListViewProps {
  properties: UnitSummary[];
  count: number;
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  setSortBy: (value: string) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleToggleNeighborhood: () => void;
  onSuccess: () => void;
}

export default function PropertyListView({
  properties,
  count,
  limit,
  offset,
  sortBy,
  withinNeighborhood,
  setSortBy,
  handleNextPage,
  handlePrevPage,
  handleToggleNeighborhood,
  onSuccess,
}: Readonly<PropertyListViewProps>) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={withinNeighborhood}
            className="sr-only peer"
            readOnly
            onClick={handleToggleNeighborhood}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-green-600"></div>
          <span className="ms-3 text-sm font-medium">
            ご近所手当範囲内のみを表示
          </span>
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-2"
        >
          <option value="price_asc">家賃が安い順</option>
          <option value="price_desc">家賃が高い順</option>
          <option value="area_desc">面積が広い順</option>
          <option value="age_asc">築年数が新しい順</option>
        </select>
      </div>

      <div>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyList key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800">
              該当する物件は見つかりませんでした。
            </h3>
            <p className="mt-2 text-gray-500">
              検索条件を変更して、再度お試しください。
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-12 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={offset === 0}
          className="px-4 py-2 bg-sky-600 rounded disabled:opacity-50 text-white cursor-pointer hover:bg-sky-300"
        >
          前へ
        </button>
        <span>
          {count > 0 ? Math.floor(offset / limit) + 1 : 0} /{" "}
          {Math.ceil(count / limit)} ページ
        </span>
        <button
          onClick={handleNextPage}
          disabled={offset + limit >= count}
          className="px-4 py-2 bg-sky-600 rounded disabled:opacity-50 text-white cursor-pointer hover:bg-sky-300"
        >
          次へ
        </button>
      </div>
      <InquiryButton properties={properties} onSuccess={onSuccess}>
        <AttachEmailIcon fontSize="medium" />
        お問い合わせ
      </InquiryButton>
    </>
  );
}
