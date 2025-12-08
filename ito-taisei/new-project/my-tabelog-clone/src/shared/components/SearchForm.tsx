// 検索フォームコンポーネント
"use client";

import StationAutocomplete from "@/shared/components/StationAutocomplete";
import GenreAutocomplete from "@/shared/components/GenreAutocomplete";
import { useState } from "react";

interface SearchFormProps {
  stations: { id: number; name: string }[];
  genres: { id: number; name: string }[];
}

export default function SearchForm({ stations, genres }: SearchFormProps) {
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [selectedGenreId, setSelectedGenreId] = useState<string>("");

  // 空のhidden値を送信しない
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const genreInput = form.querySelector('input[name="genre_id"]') as HTMLInputElement;
    const stationInput = form.querySelector('input[name="station_id"]') as HTMLInputElement;
    if (genreInput && !genreInput.value) genreInput.remove();
    if (stationInput && !stationInput.value) stationInput.remove();
  };

  return (
    <form action="/search" method="GET" className="flex gap-4 items-center mb-8" onSubmit={handleSubmit}>
      <GenreAutocomplete
        genres={genres}
        onSelect={(genre) => setSelectedGenreId(String(genre.id))}
      />
      <input type="hidden" name="genre_id" value={selectedGenreId} />
      <StationAutocomplete
        stations={stations}
        onSelect={(station) => setSelectedStationId(String(station.id))}
      />
      <input type="hidden" name="station_id" value={selectedStationId} />
      <button type="submit" className="px-4 py-2 bg-[#d9534f] text-white rounded font-bold hover:bg-[#c9302c] transition">Search!</button>
    </form>
  );
}
