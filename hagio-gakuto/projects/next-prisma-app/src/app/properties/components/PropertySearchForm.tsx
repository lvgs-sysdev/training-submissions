"use client";

import { useState, FormEvent } from "react";

// 親コンポーネントに渡す検索条件の型を定義
export interface SearchFilters {
  priceMin: string;
  priceMax: string;
  layouts: string[];
  area: string;
  walk: string;
  age: string;
  floor: boolean;
}

interface Props {
  onSearch: (filters: SearchFilters) => void;
}

export default function PropertySearchForm({ onSearch }: Readonly<Props>) {
  // フォームの入力状態を管理
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [layouts, setLayouts] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [walk, setWalk] = useState("");
  const [age, setAge] = useState("");
  const [floor, setFloor] = useState(false);

  const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setLayouts((prev) => [...prev, value]);
    } else {
      setLayouts((prev) => prev.filter((layout) => layout !== value));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 現在の入力内容をオブジェクトにまとめて、親に渡す
    onSearch({ priceMin, priceMax, layouts, area, walk, age, floor });
  };

  const handleReset = () => {
    setPriceMin("");
    setPriceMax("");
    setLayouts([]);
    setArea("");
    setWalk("");
    setAge("");
    setFloor(false);
    // 親コンポーネントにもリセットした条件を伝えて再検索させる
    onSearch({
      priceMin: "",
      priceMax: "",
      layouts: [],
      area: "",
      walk: "",
      age: "",
      floor: false,
    });
  };

  return (
    <div className=" p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">検索条件</h2>
      <form onSubmit={handleSubmit}>
        {/* 賃料 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 賃料 */}
          <div className="col-span-1">
            <label
              htmlFor="price"
              className="block text-sm font-medium light:text-gray-700"
            >
              賃料
            </label>
            <div className="mt-1 flex items-center gap-2">
              <select
                id="price-min"
                name="price-min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500  border p-2"
              >
                <option value="">下限なし</option>
                <option value="50000">5万円</option>
                <option value="80000">8万円</option>
                <option value="100000">10万円</option>
              </select>
              <span>〜</span>
              <select
                id="price-max"
                name="price-max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 border p-2"
              >
                <option value="">上限なし</option>
                <option value="80000">8万円</option>
                <option value="100000">10万円</option>
                <option value="150000">15万円</option>
              </select>
            </div>
          </div>

          {/* 間取り */}
          <div className="col-span-1">
            <label
              htmlFor="layout"
              className="block text-sm font-medium light:text-gray-700"
            >
              間取り
            </label>
            <div className="mt-1 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {["1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3LDK"].map(
                (layout) => (
                  <div key={layout} className="flex items-center">
                    <input
                      id={`layout-${layout}`}
                      name="layout"
                      type="checkbox"
                      value={layout}
                      checked={layouts.includes(layout)}
                      onChange={handleLayoutChange}
                      className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <label
                      htmlFor={`layout-${layout}`}
                      className="ml-2 text-sm light:text-gray-600"
                    >
                      {layout}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 平米数 */}
          <div className="col-span-1">
            <label
              htmlFor="area"
              className="block text-sm font-medium light:text-gray-700"
            >
              平米数
            </label>
            <select
              id="area"
              name="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 border p-2"
            >
              <option value="">指定なし</option>
              <option value="20">20㎡以上</option>
              <option value="30">30㎡以上</option>
              <option value="50">50㎡以上</option>
              <option value="70">70㎡以上</option>
            </select>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="walk"
              className="block text-sm font-medium light:text-gray-700"
            >
              駅徒歩
            </label>
            <select
              id="walk"
              name="walk"
              value={walk}
              onChange={(e) => setWalk(e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 border p-2"
            >
              <option value="">指定なし</option>
              <option value="1">1分以内</option>
              <option value="5">5分以内</option>
              <option value="10">10分以内</option>
              <option value="15">15分以内</option>
            </select>
          </div>

          {/* 築年数 */}
          <div className="col-span-1">
            <label
              htmlFor="age"
              className="block text-sm font-medium light:text-gray-700"
            >
              築年数
            </label>
            <select
              id="age"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 border p-2"
            >
              <option value="">指定なし</option>
              <option value="1">新築・1年以内</option>
              <option value="5">5年以内</option>
              <option value="10">10年以内</option>
              <option value="20">20年以内</option>
            </select>
          </div>

          {/* 階数 */}
          <div className="col-span-1">
            <label
              htmlFor="floor"
              className="block text-sm font-medium light:text-gray-700"
            >
              階数
            </label>
            <div className="mt-1 flex items-center">
              <input
                id="floor-2"
                name="floor"
                type="checkbox"
                checked={floor}
                onChange={(e) => setFloor(e.target.checked)}
                value="2"
                className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
              />
              <label
                htmlFor="floor-2"
                className="ml-2 text-sm light:text-gray-600"
              >
                2階以上
              </label>
            </div>
          </div>
        </div>

        {/* 検索ボタン */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            リセット
          </button>
          <button
            type="submit"
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            この条件で検索
          </button>
        </div>
      </form>
    </div>
  );
}
