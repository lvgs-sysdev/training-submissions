import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 全てのトーストに適用する共通オプション
const commonOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000, // 5秒で自動的に閉じる
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored", // "light", "dark", "colored" から選択
};

// 成功メッセージ用の関数
export const showSuccessToast = (message: string) => {
  toast.success(message, commonOptions);
};

// エラーメッセージ用の関数
export const showErrorToast = (message: string) => {
  toast.error(message, commonOptions);
};

// お知らせ用の関数
export const showInfoToast = (message: string) => {
  toast.info(message, commonOptions);
};
