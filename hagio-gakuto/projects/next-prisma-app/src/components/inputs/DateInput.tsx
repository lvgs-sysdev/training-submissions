"use client";

import { useState, useEffect, type ChangeEvent, type FocusEvent } from "react";
import { ErrorMsg } from "../errors/ErrorMsg";

// コンポーネントが受け取るPropsの型
interface Props {
  name: string;
  label: string;
  defaultValue?: string; // YYYY/MM/DD 形式
  rules?: ((value: string) => string | undefined)[];
  errorMsg?: string[];
}

/**
 * YYYY/MM/DD形式の自動フォーマットとバリデーション機能を持つ日付入力コンポーネント
 */
export const DateInput = ({
  name,
  label,
  defaultValue = "",
  rules = [],
  errorMsg,
}: Props) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  // サーバーからのエラーメッセージを反映
  useEffect(() => {
    if (errorMsg && errorMsg.length > 0) {
      setError(errorMsg[0]);
    }
  }, [errorMsg]);

  // 入力中の自動フォーマット処理
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 数字以外の文字をすべて削除
    let digits = e.target.value.replace(/\D/g, "");

    // 8桁（YYYYMMDD）を超えないように制限
    if (digits.length > 8) {
      digits = digits.slice(0, 8);
    }

    // 桁数に応じて "/" を自動で挿入
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)}/${digits.slice(4)}`;
    }
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6)}`;
    }

    setValue(formatted);
    // 入力中はエラーをクリア
    if (error) {
      setError(null);
    }
  };

  // フォーカスが外れた時のバリデーション処理
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 必須チェックやカスタムルールを先に実行
    for (const rule of rules) {
      const message = rule(inputValue);
      if (message) {
        setError(message);
        return;
      }
    }

    // 入力がある場合のみ、日付の妥当性をチェック
    if (inputValue) {
      // 形式チェック (YYYY/MM/DD)
      if (!/^\d{4}\/\d{2}\/\d{2}$/.test(inputValue)) {
        setError("YYYY/MM/DD形式で入力してください");
        return;
      }

      // 日付の妥当性チェック (例: 2025/02/30 のような無効な日付)
      const date = new Date(inputValue);
      const [year, month, day] = inputValue.split("/").map(Number);

      // JSのDateが自動補正するのを防ぐため、年月日が一致するかをチェック
      if (
        isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
      ) {
        setError("有効な日付を入力してください");
        return;
      }
    }

    // 全てのバリデーションを通過したらエラーをクリア
    setError(null);
  };

  return (
    <div className="mb-1 sm:mb-2">
      <label
        htmlFor={name}
        className="inline-block mb-1 font-medium dark:text-gray-600"
      >
        {label}
      </label>
      <div className="relative mb-2">
        <input
          id={name}
          name={name}
          type="text"
          placeholder="YYYY/MM/DD"
          className="flex-grow w-full h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline dark:text-gray-900 focus:ring-sky-500 focus:border-sky-500"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={10} // YYYY/MM/DD (10文字)
        />
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  );
};
