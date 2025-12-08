// 駅選択オートコンプリートコンポーネント
import Autocomplete from "./Autocomplete";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

interface StationAutocompleteProps {
  stations: AutocompleteItem[];
  onSelect: (station: AutocompleteItem) => void;
}

export default function StationAutocomplete({ stations, onSelect }: StationAutocompleteProps) {
  return (
    <Autocomplete
      items={stations}
      onSelect={onSelect}
      placeholder="Station"
      filter={(item, input) => item.name.includes(input)}
      itemClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer"
    />
  );
}
