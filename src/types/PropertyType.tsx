export type Property = {
  id: string;
  name: string;
  type: string;
  price_rent: number;
  address: {
    zip: string;
    prefecture: string;
    city: string;
    street: string;
    block: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  nearest_station: string;
  area_sqm: number;
  layout: string;
  age_years: number;
  floor: number;
  total_floors: number;
  features: string[];
  photos: string[];
  floor_plan_url: string;
  isFavorite?: boolean;
  isInquiry?: boolean;
};
