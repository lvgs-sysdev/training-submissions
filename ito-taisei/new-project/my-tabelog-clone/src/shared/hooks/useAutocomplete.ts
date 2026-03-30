// オートコンプリートの機能を提供するカスタムフック
import { useState, useRef } from "react";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

export interface UseAutocompleteOptions {
  items: AutocompleteItem[];
  filter?: (item: AutocompleteItem, input: string) => boolean;
}

export function useAutocomplete({ items, filter }: UseAutocompleteOptions) {
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterFn = filter ?? ((item, input) => item.name.includes(input));
  const filtered = input
    ? items.filter((item) => filterFn(item, input))
    : items.slice(0, 10);

  const handleSelect = (
    item: AutocompleteItem,
    onSelect: (item: AutocompleteItem) => void
  ) => {
    setInput(item.name);
    setShowList(false);
    onSelect(item);
  };

  return {
    input,
    setInput,
    showList,
    setShowList,
    inputRef,
    filtered,
    handleSelect,
  };
}
