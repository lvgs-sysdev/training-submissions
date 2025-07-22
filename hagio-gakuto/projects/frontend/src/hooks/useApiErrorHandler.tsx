import { Dispatch, SetStateAction, useState } from "react";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "../types/ValidationErrorType";
import { GenericServerError } from "../types/GenericServerErrorType";

/**
 * APIエラーを処理するためのカスタムフック
 * @param setError - react-hook-formのsetError関数
 * @returns {object} - エラーメッセージとエラー処理関数
 */
export const useApiErrorHandler = (setError: Dispatch<SetStateAction<any>>) => {
  const navigate = useNavigate();
  // 409 Conflictなど、特定のフィールドに紐付かないエラーメッセージを管理するstate
  const [nonFieldError, setNonFieldError] = useState<string | null>(null);

  /**
   * API呼び出しのcatchブロックで呼び出すエラー処理関数
   * @param e - AxiosErrorオブジェクト
   */
  const handleApiError = (e: any) => {
    console.log("エラー捕捉:", e);
    setNonFieldError(null); // ハンドリング開始時に前回のエラーをクリア

    if (e.response && e.response.data) {
      const status = e.response.status;
      const errorData = e.response.data;

      if (status === 422) {
        // バリデーションエラー
        if ("field" in errorData && typeof errorData.field === "string") {
          const validationError = errorData as ValidationError;
          setError(validationError);
        }
      } else if (status === 409) {
        // 重複エラー
        const genericError = errorData as GenericServerError;
        setNonFieldError(genericError.message); // stateにメッセージをセット
      } else if (status >= 500) {
        // サーバーエラー
        navigate("/error");
      } else {
        // その他のクライアントエラー
        const genericError = errorData as GenericServerError;
        // setError("root.serverError", {
        //   type: "server",
        //   message:
        //     genericError.message || `予期せぬエラーが発生しました (${status})`,
        // });
      }
    } else {
      // ネットワークエラー
      //   setError("root.networkError", {
      //     type: "network",
      //     message: "ネットワークに接続できませんでした。接続を確認してください。",
      //   });
    }
  };

  return {
    handleApiError,
    nonFieldError,
    clearNonFieldError: () => setNonFieldError(null),
  };
};
