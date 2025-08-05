"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout().then(() => {
      // ★ 再取得が完了してからページを遷移
      router.push("/login");
    });
  };
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      あああ
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        ログアウト
      </button>
    </div>
  );
}
