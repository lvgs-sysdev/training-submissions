import { AxiosError } from "axios";
import { UseFormSetError, FieldValues } from "react-hook-form";
import React from "react";

// 定義したエラーレスポンスの型をインポート
import { ValidationError } from "../types/ValidationErrorType";
import { GenericServerError } from "../types/GenericServerErrorType"; // 新しく作成した場合
import { ApiErrorResponse } from "../types/ApiErrorResponse"; // 新しく作成した場合
import { NavigateFunction } from "react-router-dom";

export const errorHandling = (
  // ★AxiosError のジェネリクスにユニオン型を指定
  e: AxiosError<ApiErrorResponse>,
  setValidationError: React.Dispatch<
    React.SetStateAction<ValidationError | null>
  >,
  setError: UseFormSetError<FieldValues>,
  navigate: NavigateFunction
) => {
  console.log("エラー捕捉:", e);

  // レスポンスが存在し、データがあることを確認
  if (e.response && e.response.data) {
    const status = e.response.status;
    const errorData = e.response.data; // この時点では ApiErrorResponse 型

    if (status === 422) {
      // 422 (Unprocessable Entity) の場合、バリデーションエラーの可能性が高い
      if ("field" in errorData && typeof errorData.field === "string") {
        const validationError = errorData as ValidationError; // 型アサーションで ValidationError として扱う
        // setValidationError は、useSignUp フック内で validationError ステートを更新するために使う
        setValidationError(validationError);
        // react-hook-form の setError を使って、特定のフィールドにエラーを注入する
        setError(validationError.field, {
          type: "server", // サーバーからのバリデーションエラー
          message: validationError.message,
        });
      } else {
        // 422 だが、field プロパティがないなど、予期せぬ形式のバリデーションエラー
        console.error(
          "予期せぬ形式のバリデーションエラーレスポンス:",
          errorData
        );
      }
    } else if (status === 409) {
      const error = errorData as GenericServerError;
      console.log(error.message);
      return error.message;
    } else if (status >= 400 && status < 500) {
      if ("code" in errorData && typeof errorData.code === "string") {
        const genericError = errorData as GenericServerError;
        console.error(
          `クライアントエラー (${status}):`,
          genericError.message,
          genericError.code
        );
        // 例: フォーム全体に一般的なエラーメッセージを表示
        setError("root.serverError", {
          // 'root.serverError' など、フォーム全体のエラーを示すキー
          type: "server",
          message: genericError.message || `エラーが発生しました (${status})`,
        });
      } else {
        console.error(`予期せぬ4xxエラーレスポンス (${status}):`, errorData);
        setError("root.serverError", {
          type: "server",
          message: `エラーが発生しました (${status})`,
        });
      }
    } else if (status >= 500 && status < 600) {
      // 5xx 系エラー (500 Internal Server Error, 502 Bad Gateway など)
      // GenericServerError の可能性が高い
      if ("code" in errorData && typeof errorData.code === "string") {
        const genericError = errorData as GenericServerError;
        console.error(
          `サーバーエラー (${status}):`,
          genericError.message,
          genericError.code
        );
        navigate("/error"); // ★ エラーページへ遷移
        return; // これ以降の処理は行わない
      } else {
        console.error(`予期せぬ5xxエラーレスポンス (${status}):`, errorData);
        setError("root.serverError", {
          type: "server",
          message: `サーバーで予期せぬエラーが発生しました (${status})`,
        });
      }
    } else {
      // その他のHTTPステータスコード
      console.error(`未定義のHTTPステータスコード (${status}):`, errorData);
      setError("root.serverError", {
        type: "server",
        message: `不明なエラーが発生しました (${status})`,
      });
    }
  } else {
    // レスポンス自体が存在しない場合 (ネットワークエラー、CORSエラーなど)
    console.error("ネットワークエラーまたはレスポンスなし:", e.message);
    setError("root.networkError", {
      type: "network",
      message:
        "ネットワークエラーが発生しました。インターネット接続を確認してください。",
    });
  }
};
