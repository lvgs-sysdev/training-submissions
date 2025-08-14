"use client"; // フックを使うためクライアントコンポーネントにする

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react"; // JSX内でReactNodeを使うため

// ホームアイコン用のSVGコンポーネント
const HomeIcon = () => (
  <svg
    className="w-3 h-3 me-2.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
  </svg>
);

// 区切り文字用のSVGコンポーネント
const SeparatorIcon = () => (
  <svg
    className="rtl:rotate-180 w-3 h-3 text-gray-400"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 6 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 9 4-4-4-4"
    />
  </svg>
);

const Breadcrumbs = () => {
  const pathname = usePathname();
  let pathSegments = pathname.split("/").filter((x) => x);

  // ★ 1. 配列を加工するロジック
  if (pathSegments.length > 2 && pathSegments.includes("property")) {
    const index = pathSegments.indexOf("property");
    const tempId = pathSegments[index + 1];
    pathSegments = pathSegments.filter((p) => p !== tempId);
    pathSegments[index] += `/${tempId}`;
  }

  // URLのパス名と表示名を対応させるためのマップ
  const breadcrumbNameMap: { [key: string]: React.ReactNode } = {
    login: "ログイン",
    signup: "会員登録",
    mypage: "マイページ",
    about: "会社概要",
    properties: "物件一覧",
    property: "物件詳細",
    "change-password": "パスワード変更",
    "edit-profile": "プロフィール編集",
    "delete-account": "アカウント削除",
  };

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* ホームへの固定リンク */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <HomeIcon />
            Home
          </Link>
        </li>

        {/* 動的に生成されるパンくずリスト */}
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          let displayName: React.ReactNode =
            breadcrumbNameMap[segment] || segment;

          // ★ ロジック修正: 最後の項目で、かつ親が'properties'なら表示名を上書き
          if (pathSegments[index - 1] === "properties") {
            displayName = "物件詳細";
          }

          return (
            <li key={href}>
              <div className="flex items-center">
                <SeparatorIcon />
                {isLast ? (
                  // 最後の項目はリンクではなく、テキストとして表示
                  <span className="ms-1 text-sm font-medium text-gray-500">
                    {displayName}
                  </span>
                ) : (
                  // 途中の項目はリンクとして表示
                  <Link
                    href={href}
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    {displayName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
