// 縦型レイアウト用コンポーネント
"use client";

import SearchFormBase from "@/shared/components/form/SearchFormBase";
import type { AutocompleteItem } from '@/shared/components/Autocomplete/types';

interface VerticalSearchFormProps {
  genres: AutocompleteItem[];
  stations: AutocompleteItem[];
}

export default function VerticalSearchForm({ genres, stations }: VerticalSearchFormProps) {
  return <SearchFormBase genres={genres} stations={stations} layout="vertical" inputWidth={272} inputHeight={42} />;
}
