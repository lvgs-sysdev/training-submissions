// オートコンプリートコンポーネント
"use client";

import React from "react";
import { useAutocomplete } from "@/shared/hooks/useAutocomplete";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

interface AutocompleteProps {
  items: AutocompleteItem[];
  onSelect: (item: AutocompleteItem) => void;
  placeholder?: string;
  filter?: (item: AutocompleteItem, input: string) => boolean;
  emptyText?: string;
  className?: string;
  inputStyle?: React.CSSProperties;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  items,
  onSelect,
  placeholder = "",
  filter = (item, input) => item.name.includes(input),
  emptyText = "候補がありません",
  className = "w-40",
  inputStyle,
}) => {
  const {
    input,
    setInput,
    showList,
    setShowList,
    inputRef,
    filtered,
    handleSelect,
  } = useAutocomplete({ items, filter });

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        className="px-3 py-2 rounded border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={placeholder}
        value={input}
        ref={inputRef}
        autoComplete="off"
        style={inputStyle}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 100)}
        onChange={(e) => setInput(e.target.value)}
      />
      {showList && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-gray-400">{emptyText}</li>
          ) : (
            filtered.map((item) => (
              <li
                key={item.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => handleSelect(item, onSelect)}
              >
                {item.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
