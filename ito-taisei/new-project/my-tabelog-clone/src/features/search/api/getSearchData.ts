// 検索画面用データ取得バックエンドロジック
import { prisma } from "@/shared/lib/prisma";
import { haversineDistance } from "@/shared/utils/geo";
import { RestaurantData, SearchParams } from "../types";
import { PAGE_SIZE } from "../constants";

const getStringParam = (param: string | string[] | undefined) => {
  return Array.isArray(param) ? param[0] : param;
};

// 距離順
async function fetchByDistance(
  where: any,
  currentLat: number,
  currentLng: number,
  currentPage: number
) {
  // 全件のIDと座標を取得
  const allCandidates = await prisma.restaurant.findMany({
    where,
    select: { id: true, latitude: true, longitude: true },
  });

  // 距離計算 & ソート
  const sortedCandidates = allCandidates
    .map((r) => {
      if (!r.latitude || !r.longitude) return { ...r, distance: Infinity };
      return {
        ...r,
        distance: haversineDistance(
          currentLat,
          currentLng,
          r.latitude,
          r.longitude
        ),
      };
    })
    .sort((a, b) => a.distance - b.distance);

  const totalCount = sortedCandidates.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedCandidates = sortedCandidates.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  if (paginatedCandidates.length === 0) return { restaurants: [], totalCount };

  // 詳細データ取得
  const restaurants = await prisma.restaurant.findMany({
    where: { id: { in: paginatedCandidates.map((c) => c.id) } },
    include: { genre: true, station: true },
  });

  // 順序復元
  const sortedRestaurants = paginatedCandidates
    .map((candidate) => {
      const restaurant = restaurants.find((r) => r.id === candidate.id);
      return restaurant
        ? ({ ...restaurant, distance: candidate.distance } as RestaurantData)
        : null;
    })
    .filter((r): r is RestaurantData => r !== null);

  return { restaurants: sortedRestaurants, totalCount };
}

// 通常順
async function fetchStandard(
  where: any,
  sortParam: string | undefined,
  currentPage: number,
  currentLat: number | null,
  currentLng: number | null
) {
  let orderBy: any = { created_at: "desc" };

  switch (sortParam) {
    case "rating_desc":
      orderBy = { average_rating: "desc" };
      break;
    case "review_desc":
      orderBy = { review_count: "desc" };
      break;
    case "budget_asc":
      orderBy = { budget: "asc" };
      break;
    case "budget_desc":
      orderBy = { budget: "desc" };
      break;
    case "created_at_desc":
    default:
      orderBy = { created_at: "desc" };
      break;
  }

  const [restaurantsRaw, totalCount] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      include: { genre: true, station: true },
      orderBy,
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.restaurant.count({ where }),
  ]);

  // 座標がある場合のみ距離計算
  const restaurants = restaurantsRaw.map((r) => {
    if (r.latitude && r.longitude && currentLat && currentLng) {
      return {
        ...r,
        distance: haversineDistance(
          currentLat,
          currentLng,
          r.latitude,
          r.longitude
        ),
      };
    }
    return r;
  });

  return { restaurants: restaurants as RestaurantData[], totalCount };
}

// メイン関数
export async function getSearchData(params: SearchParams) {
  //　パラメータ取得
  const genreIdStr = getStringParam(params.genre_id);
  const stationIdStr = getStringParam(params.station_id);
  const sortParam = getStringParam(params.sort);
  const pageParam = getStringParam(params.page);
  const latParam = getStringParam(params.lat);
  const lngParam = getStringParam(params.lng);

  const currentPage = Math.max(1, Number(pageParam) || 1);
  const currentLat = latParam ? Number(latParam) : null;
  const currentLng = lngParam ? Number(lngParam) : null;

  // マスタデータ取得
  const [genres, stations] = await Promise.all([
    prisma.genre.findMany({ select: { id: true, name: true } }),
    prisma.station.findMany({ select: { id: true, name: true } }),
  ]);

  // バリデーション
  const validatedGenreId = genreIdStr
    ? genres.find((g) => g.id.toString() === genreIdStr)?.id ?? null
    : null;

  const validatedStationId = stationIdStr
    ? stations.find((s) => s.id.toString() === stationIdStr)?.id ?? null
    : null;

  if (
    (genreIdStr && !validatedGenreId) ||
    (stationIdStr && !validatedStationId)
  ) {
    return {
      error: "Invalid genre or station",
      genres,
      stations,
      restaurants: [],
      totalCount: 0,
      currentPage,
      pageSize: PAGE_SIZE,
    };
  }

  // クエリ作成
  const where: any = {
    isPublic: true,
  };
  if (validatedGenreId) where.genre_id = validatedGenreId;
  if (validatedStationId) where.station_id = validatedStationId;

  // データ取得実行
  let result;
  if (sortParam === "distance" && currentLat && currentLng) {
    result = await fetchByDistance(where, currentLat, currentLng, currentPage);
  } else {
    result = await fetchStandard(
      where,
      sortParam,
      currentPage,
      currentLat,
      currentLng
    );
  }

  return {
    genres,
    stations,
    restaurants: result.restaurants,
    totalCount: result.totalCount,
    selectedGenre: genres.find((g) => g.id === validatedGenreId),
    selectedStation: stations.find((s) => s.id === validatedStationId),
    currentPage,
    pageSize: PAGE_SIZE,
  };
}
