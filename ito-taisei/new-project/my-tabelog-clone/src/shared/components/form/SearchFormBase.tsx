// 共通検索フォームコンポーネント
"use client";

import { useState } from "react";
import GenreAutocomplete from "@/shared/components/form/GenreAutocomplete";
import StationAutocomplete from "@/shared/components/form/StationAutocomplete";
import type { AutocompleteItem } from "@/shared/components/Autocomplete/types";

interface SearchFormBaseProps {
  genres: AutocompleteItem[];
  stations: AutocompleteItem[];
  layout?: "vertical" | "horizontal";
  inputWidth?: number;
  inputHeight?: number;
  onSubmit?: (params: { genre_id?: string; station_id?: string }) => void;
}

export default function SearchFormBase({ genres, stations, layout = "horizontal", inputWidth, inputHeight, onSubmit }: SearchFormBaseProps) {
  const [selectedGenreId, setSelectedGenreId] = useState<string>("");
  const [selectedStationId, setSelectedStationId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        genre_id: selectedGenreId || undefined,
        station_id: selectedStationId || undefined,
      });
    } else {
      // デフォルト: URL遷移
      const params = new URLSearchParams();
      if (selectedGenreId) params.set("genre_id", selectedGenreId);
      if (selectedStationId) params.set("station_id", selectedStationId);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const inputStyle = inputWidth && inputHeight
    ? { width: `${inputWidth}px`, height: `${inputHeight}px` }
    : {};

  return (
    <form onSubmit={handleSubmit} className={`flex ${layout === "vertical" ? "flex-col gap-4 mb-8" : "gap-4 items-center mb-8"}`}>
      <GenreAutocomplete
        genres={genres}
        onSelect={(genre) => setSelectedGenreId(String(genre.id))}
        inputStyle={inputStyle}
      />
      <input type="hidden" name="genre_id" value={selectedGenreId} />
      <StationAutocomplete
        stations={stations}
        onSelect={(station) => setSelectedStationId(String(station.id))}
        inputStyle={inputStyle}
      />
      <input type="hidden" name="station_id" value={selectedStationId} />
      <button type="submit" className="px-4 py-2 bg-[#d9534f] text-white rounded font-bold hover:bg-[#c9302c] transition w-full">
        Search!
      </button>
    </form>
  );
}
