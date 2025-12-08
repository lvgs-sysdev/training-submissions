// ジャンル選択オートコンプリートコンポーネント
import Autocomplete from "./Autocomplete";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

interface GenreAutocompleteProps {
  genres: AutocompleteItem[];
  onSelect: (genre: AutocompleteItem) => void;
}

export default function GenreAutocomplete({ genres, onSelect }: GenreAutocompleteProps) {
  return (
    <Autocomplete
      items={genres}
      onSelect={onSelect}
      placeholder="Genre"
      filter={(item, input) => item.name.toLowerCase().includes(input.toLowerCase())}
      itemClassName="px-3 py-2 hover:bg-gray-100 cursor-pointer"
    />
  );
}
