import { Prisma } from "@/generated/client";

type RestaurantRaw = Prisma.RestaurantGetPayload<{
  include: { genre: true; station: true };
}>;

export interface RestaurantData {
  id: string;
  name: string;
  address: string;
  image_url: string;
  genre: string;
  station: string;
  average_rating: number;
  opening_hours: string;
  link: string;
}

export function formatRestaurantResponse(r: RestaurantRaw): RestaurantData {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    image_url: r.image_url ?? "",
    genre: r.genre?.name ?? "",
    station: r.station?.name ?? "",
    average_rating: r.average_rating,
    opening_hours: r.opening_hours ?? "",
    link: r.link ?? "",
  };
}
