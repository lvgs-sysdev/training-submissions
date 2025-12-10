// 検索フォームコンポーネント
"use client";

import SearchFormBase from "@/shared/components/form/SearchFormBase";

interface SearchFormProps {
  stations: { id: number; name: string }[];
  genres: { id: number; name: string }[];
}

export default function SearchForm({ stations, genres }: SearchFormProps) {
  return <SearchFormBase genres={genres} stations={stations} layout="horizontal" inputWidth={160} inputHeight={42} />;
}
