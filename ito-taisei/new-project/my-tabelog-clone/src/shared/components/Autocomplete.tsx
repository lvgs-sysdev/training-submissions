// オートコンプリートコンポーネント
import React from "react";
import { useAutocomplete } from "@/shared/hooks/useAutocomplete";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

interface AutocompleteProps {
  items: AutocompleteItem[];
  onSelect: (item: AutocompleteItem) => void;
  placeholder?: string;
  filter?: (item: AutocompleteItem, input: string) => boolean;
  inputClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  emptyText?: string;
  className?: string;
}


const Autocomplete: React.FC<AutocompleteProps> = ({
  items,
  onSelect,
  placeholder = "",
  filter = (item, input) => item.name.includes(input),
  inputClassName = "px-3 py-2 rounded border border-gray-300 w-full",
  listClassName = "absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow",
  itemClassName = "px-3 py-2 hover:bg-blue-100 cursor-pointer",
  emptyText = "候補がありません",
  className = "w-40",
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
        className={inputClassName}
        placeholder={placeholder}
        value={input}
        ref={inputRef}
        autoComplete="off"
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 100)}
        onChange={(e) => setInput(e.target.value)}
      />
      {showList && (
        <ul className={listClassName}>
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-gray-400">{emptyText}</li>
          ) : (
            filtered.map((item) => (
              <li
                key={item.id}
                className={itemClassName}
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
