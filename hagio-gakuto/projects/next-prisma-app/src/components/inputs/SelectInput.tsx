"use client";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  defaultValue?: string;
  className?: string;
};

export const SelectInput = ({
  name,
  label,
  options,
  defaultValue = "",
  className,
}: Props) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 border p-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};