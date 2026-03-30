// 検索に必要なジャンルと駅のデータを取得してSearchFormに渡す
import { getGenres } from '@/shared/api/genre/genre';
import { getStations } from '@/shared/api/station/station';
import SearchFormBase from '@/shared/components/form/SearchFormBase';

export default async function SearchArea() {
  const [genres, stations] = await Promise.all([
    getGenres(),
    getStations(),
  ]);

  return <SearchFormBase genres={genres} stations={stations} layout="horizontal" inputWidth={160} inputHeight={42} />;
}
