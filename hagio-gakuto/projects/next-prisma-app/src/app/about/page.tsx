import { Metadata } from "next";
import React from "react";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export const metadata: Metadata = {
  title: "このアプリについて",
};

const AboutUsPage: React.FC = () => {
  return (
    <div className="">
      {/* ヒーローセクション */}
      <section className="bg-sky-600 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            本社勤務社員向け家探しサポート
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            ご近所手当対象エリアの物件探しを、もっとスムーズに、もっとお得に。
          </p>
        </div>
      </section>

      {/* このアプリについて */}
      <section id="about" className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-sky-800 dark:text-sky-400">
            「職住近接」で、新しい働き方を
          </h2>
          <p className="mt-4 text-lg ">
            このアプリは、本社オフィス周辺に住むことで支給される「ご近所手当」制度を最大限に活用し、社員の皆さんの快適な新生活をサポートするために開発されました。面倒な物件探しから、提携不動産会社や引越し業者との連携まで、ワンストップで提供します。
          </p>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section id="features">
        <div className="container mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-center text-sky-800 dark:text-sky-400 mb-10">
            主な機能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 機能 1: 範囲内検索 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <SavedSearchIcon
                fontSize="large"
                className="w-12 h-12 mx-auto text-sky-600"
              />
              <h3 className="mt-4 text-xl font-semibold dark:text-gray-800">
                ご近所手当対象エリア検索
              </h3>
              <p className="mt-2 text-gray-600">
                手当の対象となる物件だけを地図や条件から簡単に探し出すことができます。
              </p>
            </div>

            {/* 機能 2: 不動産連携 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <DynamicFeedIcon
                fontSize="large"
                className="w-12 h-12 mx-auto text-sky-600"
              />
              <h3 className="mt-4 text-xl font-semibold dark:text-gray-800">
                提携不動産会社への連携
              </h3>
              <p className="mt-2 text-gray-600">
                気になる物件が見つかったら、仲介手数料割引などの特典がある提携不動産会社へスムーズに連絡できます。
              </p>
            </div>

            {/* 機能 3: 引越し業者連携 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <ReceiptLongIcon
                fontSize="large"
                className=" mx-auto text-sky-600"
              />
              <h3 className="mt-4 text-xl font-semibold dark:text-gray-800">
                提携引越し業者の相見積もり
              </h3>
              <p className="mt-2 text-gray-600">
                複数の提携引越し業者から一括で見積もりを取り、お得なプランを選ぶことができます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 利用開始セクション */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold text-sky-800 dark:text-sky-400">
          さあ、始めましょう
        </h2>
        <p className="mt-4 text-lg ">
          次のページから、あなたの新生活にぴったりの物件を探してみてください。
        </p>
        <a
          href="/properties"
          className="mt-8 inline-block bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-700 transition-colors"
        >
          物件一覧へ
        </a>
      </section>
    </div>
  );
};

export default AboutUsPage;
