"use client";

import { useEffect, useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ErrorMsg } from "@/components/errors/ErrorMsg"; // エラーメッセージ表示用のコンポーネント
interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
  errorMsg?: string[]; // エラーメッセージを配列で受け取る
  defaultValue?: string; // 初期値を設定するためのプロパティ
  rules?: ((value: string) => string | undefined)[];
}

export function PasswordInput({
  name,
  label,
  placeholder,
  errorMsg,
  defaultValue = "",
  rules = [],
}: Readonly<InputProps>) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (errorMsg && errorMsg.length > 0) {
      setValidationError(errorMsg[0]);
    } else {
      setValidationError(null);
    }
  }, [errorMsg]);

  const handleInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    for (const rule of rules) {
      const msg = rule(value);
      if (msg) {
        setValidationError(msg);
        return;
      }
    }
    setValidationError(null);
  };

  return (
    <div className="mb-1 sm:mb-2">
      {label && (
        <label className="inline-block mb-1 font-medium dark:text-gray-600">
          {label}
        </label>
      )}
      <div className="relative mb-2">
        <input
          type={showPassword ? "text" : "password"}
          className="flex-grow w-full h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline dark:text-gray-900"
          placeholder={placeholder}
          name={name}
          defaultValue={defaultValue}
          onInput={handleInput}
        />
        {/* トグルボタン */}
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/4 cursor hover"
        >
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </button>
      </div>
      {validationError && <ErrorMsg msg={validationError} />}
    </div>
  );
}
