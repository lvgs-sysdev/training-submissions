// 関連モデルの型を定義
export type PropertyType = {
  id: number;
  name: string;
};

export type Layout = {
  id: number;
  name: string;
};

// メインのPropertyの型
export type Property = {
  id: number;
  name: string;
  priceRent: number;
  zip: string;
  prefecture: string;
  city: string;
  town: string;
  chome: number;
  block: number;
  building: string | null;
  nearestStation: string;
  walkToStation: number;
  areaSqm: number;
  buildDate: Date;
  floor: number;
  totalFloors: number;
  floorPlanUrl: string;
  roomNumber: string | null;
  isEmpty: boolean | null;
  propertyType: PropertyType;
  layout: Layout;
  features: string[];
  photos: string[];
  isFavorite: boolean;
  isInquiry: boolean;
};
