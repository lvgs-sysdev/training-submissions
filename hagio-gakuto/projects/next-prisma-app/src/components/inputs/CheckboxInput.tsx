"use client";

type Props = {
  name: string;
  label: string;
  defaultChecked?: boolean;
  className?: string;
};

export const CheckboxInput = ({
  name,
  label,
  defaultChecked = false,
  className,
}: Props) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">階数</label>
      <div className="mt-1 flex items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
        />
        <label htmlFor={name} className="ml-2 text-sm text-gray-600">
          {label}
        </label>
      </div>
    </div>
  );
};