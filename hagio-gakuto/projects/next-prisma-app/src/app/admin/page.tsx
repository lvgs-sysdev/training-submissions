import Link from "next/link";
import React from "react";

// --- アイコンコンポーネント (Heroiconsから) ---
const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const DocumentTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const ChartBarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const CogIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function AdminPage() {
  // ダミーデータ
  const stats = [
    { name: "総ユーザー数", value: "1,428", icon: <UsersIcon /> },
    { name: "公開物件数", value: "972", icon: <DocumentTextIcon /> },
    { name: "月間PV", value: "25.4k", icon: <ChartBarIcon /> },
  ];

  const adminLinks = [
    { name: "ユーザー管理", href: "#", icon: <UsersIcon /> },
    { name: "物件管理", href: "/admin/properties", icon: <DocumentTextIcon /> },
    { name: "アクセス解析", href: "#", icon: <ChartBarIcon /> },
    { name: "システム設定", href: "#", icon: <CogIcon /> },
  ];

  return (
    <div className="flex">
      {/* --- サイドバー --- */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-sky-600 border-b">
          Admin Panel
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {adminLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-sky-100 hover:text-sky-600 transition-colors duration-200"
                >
                  {link.icon}
                  <span className="ml-4">{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* --- メインコンテンツ --- */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            管理者ダッシュボード
          </h1>
          <p className="text-gray-500 mt-1">ようこそ、管理者さん</p>
        </header>

        {/* --- 統計サマリー --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center"
            >
              <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* --- 管理メニューリンク --- */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            管理メニュー
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="p-4 bg-sky-100 text-sky-600 rounded-full mb-4">
                  {link.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{link.name}</h3>
                <p className="text-sm text-gray-500 mt-1">設定画面へ</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
