"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import { useTitle } from "@/hooks/useTitle";
import Link from "next/link";
import { useLoading } from "@/context/LoadingContext"; // ローディングを追加

export default function MyInfoCard() {
  useTitle("マイページ");
  const { user } = useAuth();
  const { setIsLoading } = useLoading(); // ローディング状態を取得

  // ユーザー情報が読み込まれるまでローディング表示
  if (!user) {
    setIsLoading(true); // ローディング状態を設定
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={user?.avatar_url || "/images/avatars/default-avatar.png"}
              alt="User Avatar"
              fill
              priority
              sizes="96px"
              className="rounded-full object-cover ring-4 ring-sky-500"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
          <p className="mt-1 text-md text-gray-500">{user?.email}</p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col space-y-4">
          <Link
            href="/mypage/edit-profile"
            className="w-full text-center px-4 py-3 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-all duration-200"
          >
            プロフィールを編集
          </Link>

          <Link
            href="/mypage/change-password"
            className="w-full text-center px-4 py-3 font-semibold text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-all duration-200"
          >
            パスワードを変更
          </Link>

          <Link
            href="/mypage/delete-account"
            className="w-full text-center px-4 py-3 font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-all duration-200"
          >
            アカウントを削除
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
