"use client";

import { useAuth } from "@/context/AuthContext";
import { showSuccessToast } from "@/utils/ToastUtils";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccessToast("ログアウトしました");
      router.push("/login");
    } catch (error) {
      // エラーハンドリング
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-3 font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-all duration-200"
    >
      ログアウト
    </button>
  );
}
