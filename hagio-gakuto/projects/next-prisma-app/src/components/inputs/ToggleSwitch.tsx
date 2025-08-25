"use client";

type Props = {
  name: string;
  label: string;
  defaultChecked?: boolean;
};

export const ToggleSwitch = ({
  name,
  label,
  defaultChecked = false,
}: Props) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
      <span className="ms-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
};