"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image"; // Next.jsのImageコンポーネントを使用
import LogoutButton from "./LogoutButton";
import { useTitle } from "@/hooks/useTitle";
import Link from "next/link";

export default function MyInfoCard() {
  useTitle("マイページ");
  const { user } = useAuth();
  console.log(user?.avatar_url || "/image/avatar/default-avatar.png");

  return (
    <div className="p-8">
      <div className="flex flex-col items-center">
        {/* アバター画像 */}
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={user?.avatar_url || "/images/avatars/default-avatar.png"} // デフォルトアバターを用意
            alt="User Avatar"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            className="rounded-full object-cover ring-2 ring-sky-500 ring-offset-2"
          />
        </div>

        {/* ユーザー名 */}
        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>

        {/* メールアドレス */}
        <p className="mt-1 text-md text-gray-500">{user?.email}</p>
      </div>

      {/* アクションボタン */}
      <div className="mt-8 space-y-4">
        <Link
          href="/edit-profile"
          aria-label="Edit Profile"
          title="Edit Profile"
        >
          <button className="w-full px-4 py-3 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all duration-200">
            プロフィールを編集
          </button>
        </Link>

        <Link
          href="/change-password"
          aria-label="Change Password"
          title="Change Password"
        >
          <button className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200">
            パスワードを変更
          </button>
        </Link>

        <LogoutButton />
      </div>
    </div>
  );
}
