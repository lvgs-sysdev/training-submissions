"use client";

import { useEffect, useState } from "react";
import { ErrorMsg } from "../errors/ErrorMsg";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  errorMsg?: string[];
  defaultValue?: string;
  value?: string;
  rules?: ((value: string) => string | undefined)[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const TextInput = ({
  name,
  label,
  placeholder,
  errorMsg,
  defaultValue,
  rules = [],
  value,
  onChange,
  ...rest
}: Props) => {
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
    <div className="mb-1 sm:mb-2 flex-1">
      {label && (
        <label className="inline-block mb-1 font-medium dark:text-gray-600">
          {label}
        </label>
      )}
      <div className="relative mb-2">
        <input
          type="text"
          className="flex-grow w-full h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline dark:text-gray-900 focus:ring-sky-500 focus:border-sky-500"
          onInput={handleInput}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
      {validationError && <ErrorMsg msg={validationError} />}
    </div>
  );
};
