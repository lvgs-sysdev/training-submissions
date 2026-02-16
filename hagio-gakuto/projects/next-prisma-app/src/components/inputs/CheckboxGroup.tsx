"use client";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  defaultValues?: string[];
  className?: string;
};

export const CheckboxGroup = ({
  name,
  label,
  options,
  defaultValues = [],
  className,
}: Props) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 grid grid-cols-3 sm:grid-cols-4 gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="checkbox"
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
              className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-2 text-sm text-gray-600"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};