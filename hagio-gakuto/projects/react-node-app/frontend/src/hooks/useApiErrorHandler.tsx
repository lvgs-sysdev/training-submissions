import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "../types/ValidationErrorType";
import { GenericServerError } from "../types/GenericServerErrorType";
import { ERROR_MESSAGES } from "../constants/errorMessages";

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
      } else if (status === 409 || status === 401) {
        // 重複エラー
        const genericError = errorData as GenericServerError;
        setNonFieldError(genericError.message); // stateにメッセージをセット
      } else if (status >= 500) {
        // サーバーエラー
        navigate("/error", { state: { statusCode: 500, message: "ss" } });
      } else {
        navigate("/error", { state: { statusCode: 500, message: "ss" } });
      }
    } else {
      // ネットワークエラー
      navigate("/error", { state: { message: ERROR_MESSAGES.NETWORK_ERROR } });
    }
  };

  return {
    handleApiError,
    nonFieldError,
    clearNonFieldError: () => setNonFieldError(null),
  };
};
