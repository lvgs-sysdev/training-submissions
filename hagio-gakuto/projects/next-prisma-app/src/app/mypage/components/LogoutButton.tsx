"use client";

import { useAuth } from "@/context/AuthContext";
import { showSuccessToast } from "@/utils/ToastUtils";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";

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
      className="w-full text-center px-4 py-3 font-semibold text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-all duration-200 flex items-center justify-center"
    >
      <LogoutIcon className="inline mr-2" />
      ログアウト
    </button>
  );
}
