// レストランAPIレスポンス整形ユーティリティ
import { Prisma } from "@/generated/client";

type RestaurantData = Prisma.RestaurantGetPayload<{
  include: {
    genre: true;
    station: true;
  };
}>;

export function formatRestaurantResponse(r: RestaurantData) {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    image_url: r.image_url,
    genre: r.genre,
    average_rating: r.average_rating,
    station: r.station?.name ?? "",
    opening_hours: r.opening_hours,
    link: r.link,
  };
}
