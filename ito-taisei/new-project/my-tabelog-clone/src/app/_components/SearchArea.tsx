// 検索に必要なジャンルと駅のデータを取得してSearchFormに渡す
import { getGenres } from '@/shared/api/genre';
import { getStations } from '@/shared/api/station';
import SearchForm from '@/shared/components/SearchForm';

export default async function SearchArea() {
  const [genres, stations] = await Promise.all([
    getGenres(),
    getStations(),
  ]);

  return <SearchForm genres={genres} stations={stations} />;
}
