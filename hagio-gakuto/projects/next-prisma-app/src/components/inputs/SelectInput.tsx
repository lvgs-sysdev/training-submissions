"use client";

import { useEffect, useState } from "react";
import { ErrorMsg } from "../errors/ErrorMsg";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  errorMsg?: string[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const SelectInput = ({
  name,
  label,
  options,
  errorMsg,
  value, // propsとして受け取る
  onChange, // propsとして受け取る
}: Props) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (errorMsg && errorMsg.length > 0) {
      setValidationError(errorMsg[0]);
    } else {
      setValidationError(null);
    }
  }, [errorMsg]);

  return (
    <div className="mb-1 sm:mb-2 flex-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mb-2">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="flex-grow w-full h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline dark:text-gray-900 focus:ring-sky-500 focus:border-sky-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {validationError && <ErrorMsg msg={validationError} />}
    </div>
  );
};
