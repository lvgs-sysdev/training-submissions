"use client";

import { useFormContext } from "react-hook-form";
import { ErrorMsg } from "../errors/ErrorMsg";
import { useEffect } from "react";
import { ValidationError } from "../../types/ValidationErrorType";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  errorMsg?: ValidationError;
  rules?: any;
};
export const EmailInput = ({
  name,
  label,
  placeholder,
  errorMsg,
  rules,
}: Props) => {
  const {
    register,
    formState: { errors },
    setError,
  } = useFormContext();

  useEffect(() => {
    if (errorMsg && errorMsg.field === name) {
      setError(name, {
        type: "manual",
        message: errorMsg.message,
      });
    }
  }, [errorMsg, name, setError]); // ★ nameとsetErrorを追加

  return (
    <div className="mb-1 sm:mb-2">
      {label && (
        <label className="inline-block mb-1 font-medium">{label}</label>
      )}
      <div className="relative mb-2">
        <input
          type="email"
          className="flex-grow w-full h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
          {...register(name, rules)}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && (
        <ErrorMsg
          msg={
            typeof errors[name]?.message === "string"
              ? errors[name]?.message
              : "Invalid error message"
          }
        />
      )}
    </div>
  );
};
