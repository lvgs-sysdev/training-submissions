// 検索画面
import { getSearchData } from "@/features/search/api/getSearchData";
import VerticalSearchForm from "@/features/search/components/VerticalSearchForm";
import SearchHeader from "@/features/search/components/SearchHeader";
import SortSelect from "@/features/search/components/SortSelect";
import RestaurantList from "@/features/search/components/RestaurantList";
import Pagination from "@/features/search/components/Pagination";

interface SearchPageProps {
  searchParams: Promise<{ 
    genre_id?: string | string[]; 
    station_id?: string | string[]; 
    sort?: string | string[];
    page?: string | string[];
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  const { 
    genres, 
    stations, 
    restaurants, 
    selectedGenre, 
    selectedStation, 
    error,
    totalCount,
    currentPage,
    pageSize
  } = await getSearchData(params);

  const safeTotalCount = totalCount ?? 0;
  const safeCurrentPage = currentPage ?? 1;
  const safePageSize = pageSize ?? 10;

  const sortParam = (Array.isArray(params.sort) ? params.sort[0] : params.sort) ?? "";

  if (error) {
    return <div className="text-red-500 pt-24 text-center">{error}</div>;
  }

  return (
    <main className="pt-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-row gap-8 p-4">
        <aside className="w-80 min-w-[240px] bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24 hidden md:block">
          <h2 className="text-xl font-bold mb-4 text-[#d9534f]">Refine search</h2>
          <VerticalSearchForm genres={genres} stations={stations} />
          <div className="mt-1 pt-1 border-t border-gray-300">
            <SortSelect />
          </div>
        </aside>

        <section className="flex-1 flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-2 text-[#d9534f]">Search Results</h2>
            
            <SearchHeader 
              genreName={selectedGenre?.name} 
              stationName={selectedStation?.name}
              resultCount={safeTotalCount} 
            />
            
            <div className="text-sm text-gray-500 mt-2">
              全 {safeTotalCount} 件中 {Math.min((safeCurrentPage - 1) * safePageSize + 1, safeTotalCount)} - {Math.min(safeCurrentPage * safePageSize, safeTotalCount)} 件を表示
            </div>
          </div>

          {restaurants.length > 0 ? (
            <>
              <RestaurantList restaurants={restaurants} />
              
              <Pagination 
                totalCount={safeTotalCount} 
                pageSize={safePageSize} 
                currentPage={safeCurrentPage} 
              />
            </>
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm">
              条件に一致するレストランは見つかりませんでした。
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
