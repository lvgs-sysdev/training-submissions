// レストランAPIレスポンスをRestaurantData型に変換するユーティリティ関数
import { Prisma } from "@/generated/client";
import type { RestaurantData } from "@/shared/types/restaurant";

type RestaurantRaw = Prisma.RestaurantGetPayload<{
  include: { genre: true; station: true };
}>;

export function formatRestaurantResponse(r: RestaurantRaw): RestaurantData {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    genre_id: r.genre_id,
    review_count: r.review_count,
    image_url: r.image_url ?? "",
    genre: r.genre
      ? { id: r.genre.id, name: r.genre.name }
      : { id: 0, name: "" },
    station: r.station
      ? { id: r.station.id, name: r.station.name }
      : { id: 0, name: "" },
    average_rating: r.average_rating,
    opening_hours: r.opening_hours ?? "",
    link: r.link ?? "",
  };
}
