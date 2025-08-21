import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "引越し見積もり依頼",
};

const furnitureList = [
  "冷蔵庫",
  "洗濯機",
  "ベッド",
  "ソファ",
  "テーブル",

  "タンス",
  "テレビ",
  "電子レンジ",
];
const boxSizes = ["S (〜5箱)", "M (〜10箱)", "L (〜15箱)", "XL (16箱〜)"];

const MovingEstimateForm = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-sky-800 md:text-4xl">
            引越し料金の一括見積もり
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            提携引越し業者にまとめて見積もりを依頼できます。
          </p>
        </div>

        <form className="mt-10 bg-white p-8 rounded-xl shadow-lg space-y-8">
          {/* 基本情報セクション */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6">
              お客様情報
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="people"
                  className="block text-sm font-medium text-gray-700"
                >
                  ご入居人数
                </label>
                <select
                  id="people"
                  name="people"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                >
                  <option>1人</option>
                  <option>2人</option>
                  <option>3人</option>
                  <option>4人以上</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="contact@example.com"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* 住所情報セクション */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6">
              ご住所
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="current-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  現在のお住まい
                </label>
                <input
                  type="text"
                  id="current-address"
                  name="current-address"
                  placeholder="東京都渋谷区..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label
                  htmlFor="new-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  引越し予定地
                </label>
                <input
                  type="text"
                  id="new-address"
                  name="new-address"
                  placeholder="東京都目黒区..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* 荷物情報セクション */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6">
              お荷物の情報
            </h2>
            {/* 家具リスト */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                主な家具
              </label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {furnitureList.map((item) => (
                  <div key={item} className="flex items-center">
                    <input
                      id={`furniture-${item}`}
                      name="furniture"
                      type="checkbox"
                      value={item}
                      className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <label
                      htmlFor={`furniture-${item}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* 段ボール数 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                段ボールのおおよその数
              </label>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                {boxSizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <input
                      id={`box-${size}`}
                      name="box-size"
                      type="radio"
                      className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                    />
                    <label
                      htmlFor={`box-${size}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 見積もりボタン */}
          <div className="pt-6 text-right">
            <button
              type="submit"
              className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              見積もりを依頼する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovingEstimateForm;
