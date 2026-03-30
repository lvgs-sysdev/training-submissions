export type RestaurantData = {
  id: string;
  name: string;
  address: string;
  station_id?: number | null;
  genre_id: number;
  image_url?: string | null;
  link?: string | null;
  budget?: number | null;
  opening_hours?: string | null;
  average_rating: number;
  review_count: number;
  latitude?: number | null;
  longitude?: number | null;
  genre?: { id: number; name: string };
  station?: { id: number; name: string } | null;
  distance?: number;
};

export interface SearchParams {
  genre_id?: string | string[];
  station_id?: string | string[];
  sort?: string | string[];
  page?: string | string[];
  lat?: string | string[];
  lng?: string | string[];
}
