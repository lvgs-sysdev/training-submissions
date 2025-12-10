// 駅選択オートコンプリートコンポーネント
"use client";

import Autocomplete from "./Autocomplete";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

interface StationAutocompleteProps {
  stations: AutocompleteItem[];
  onSelect: (station: AutocompleteItem) => void;
  inputStyle?: React.CSSProperties;
}

export default function StationAutocomplete({ stations, onSelect, inputStyle }: StationAutocompleteProps) {
  return (
    <Autocomplete
      items={stations}
      onSelect={onSelect}
      placeholder="Station"
      filter={(item, input) => item.name.includes(input)}
      inputStyle={inputStyle}
    />
  );
}
