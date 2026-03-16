// ジャンル選択オートコンプリートコンポーネント
"use client";

import Autocomplete from "./Autocomplete";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

interface GenreAutocompleteProps {
  genres: AutocompleteItem[];
  onSelect: (genre: AutocompleteItem) => void;
  inputStyle?: React.CSSProperties;
}

export default function GenreAutocomplete({ genres, onSelect, inputStyle }: GenreAutocompleteProps) {
  return (
    <Autocomplete
      items={genres}
      onSelect={onSelect}
      placeholder="Genre"
      filter={(item, input) => item.name.toLowerCase().includes(input.toLowerCase())}
      inputStyle={inputStyle}
    />
  );
}
