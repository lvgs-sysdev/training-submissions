// 共通で使うレストラン型定義
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
};
