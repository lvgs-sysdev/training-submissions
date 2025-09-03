import {
  Feature,
  ImageCategory,
  Layout,
  PropertyType,
} from "./PropertyMasterTypes";

export type Building = {
  id: number;
  name: string;
  zipCode: string;
  prefecture: string;
  city: string;
  town: string;
  chome: string | null;
  block: string;
  nearestStation: string;
  walkToStation: number;
  buildDate: Date;
  totalFloors: number;
  propertyTypeId: number;
};

export type Unit = {
  id: number;
  priceRent: number;
  areaSqm: number; // PrismaのDecimalはフロントエンドではnumberとして扱う
  floor: number;
  roomNumber: string | null;
  isEmpty: boolean;
  buildingId: number;
  layoutId: number;
};

export type Image = {
  id: number;
  imageUrl: string;
  categoryId: number;
  buildingId: number;
  unitId: number | null;
};

// ================================================================
//  UI表示やAPIレスポンス用の拡張された型
// ================================================================

/**
 * 物件一覧ページなどで使用するサマリー用の型
 */
export type UnitSummary = {
  id: number; // UnitのID
  priceRent: number;
  areaSqm: number;
  floor: number;
  buildingName: string;
  address: string; // "東京都渋谷区..." のように結合された住所
  nearestStation: string;
  walkToStation: number;
  layout: string; // "1LDK"
  buildDate: Date;
  thumbnailUrl: string | null; // 代表画像
  isFavorite: boolean;
  isInquiry: boolean;
};

/**
 * 物件詳細ページで使用する詳細な型
 */
export type UnitDetail = {
  // Unitの基本情報
  id: number;
  priceRent: number;
  areaSqm: number;
  floor: number;
  roomNumber: string | null;
  isEmpty: boolean;

  // 関連するマスターデータ
  layout: Layout;
  features: Feature[];

  // 関連するBuildingの情報
  building: {
    id: number;
    name: string;
    address: string;
    nearestStation: string;
    walkToStation: number;
    buildDate: Date;
    totalFloors: number;
    propertyType: PropertyType;
  };

  // 部屋固有の画像と建物共通の画像を結合したもの
  allImages: (Image & { category: ImageCategory })[];

  // ユーザー固有の状態
  isFavorite: boolean;
  isInquiry: boolean;
};
