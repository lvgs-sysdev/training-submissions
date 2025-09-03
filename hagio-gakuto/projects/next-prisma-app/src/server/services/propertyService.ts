import { prisma } from "@/lib/prisma";
import { ImageCategory } from "@/types/PropertyMasterTypes";
import { Image, UnitDetail } from "@/types/PropertyType";
import { Prisma } from "@prisma/client";

// Unit詳細を取得する際に含める関連モデルを定義
const unitDetailWithRelations = Prisma.validator<Prisma.UnitDefaultArgs>()({
  include: {
    layout: true,
    building: {
      include: {
        propertyType: true,
        images: {
          // 建物共通の画像を取得
          where: { unitId: null },
          include: { category: true },
        },
      },
    },
    images: {
      // 部屋固有の画像を取得
      include: { category: true },
    },
    unitFeatures: {
      include: {
        feature: true,
      },
    },
    favorites: true, // ユーザーによる絞り込みは変換時に行う
    inquiries: true,
  },
});

// 上記の定義からPrismaのペイロード型を生成
type PrismaUnitDetailPayload = Prisma.UnitGetPayload<
  typeof unitDetailWithRelations
>;

/**
 * 複数の住所パーツを結合して、整形された一つの住所文字列を生成する
 */
function formatAddress(building: PrismaUnitDetailPayload["building"]): string {
  const parts = [
    building.prefecture,
    building.city,
    building.town,
    building.chome ? `${building.chome}丁目` : null,
    building.block,
  ];
  return parts.filter((part) => part).join("");
}

/**
 * Prismaから取得したUnitデータをアプリケーションで使いやすいUnitDetail形式に変換する
 */
function convertToUnitDetail(
  unitFromDb: PrismaUnitDetailPayload,
  userId?: number | null
): UnitDetail {
  // 建物共通の画像と部屋固有の画像を結合し、カテゴリ名も付与する
  const buildingImages: (Image & { category: ImageCategory })[] =
    unitFromDb.building.images.map((img) => ({
      ...img,
      category: img.category,
    }));
  const unitImages: (Image & { category: ImageCategory })[] =
    unitFromDb.images.map((img) => ({
      ...img,
      category: img.category,
    }));

  const allImages = [...buildingImages, ...unitImages];

  return {
    // Unitの基本情報
    id: unitFromDb.id,
    priceRent: unitFromDb.priceRent,
    areaSqm: unitFromDb.areaSqm.toNumber(),
    floor: unitFromDb.floor,
    roomNumber: unitFromDb.roomNumber,
    isEmpty: unitFromDb.isEmpty,

    // 関連するマスターデータ（オブジェクト全体を渡すように修正）
    layout: unitFromDb.layout,
    features: unitFromDb.unitFeatures.map((uf) => uf.feature),

    // 関連するBuildingの情報をネストして格納
    building: {
      id: unitFromDb.building.id,
      name: unitFromDb.building.name,
      address: formatAddress(unitFromDb.building),
      nearestStation: unitFromDb.building.nearestStation,
      walkToStation: unitFromDb.building.walkToStation,
      buildDate: unitFromDb.building.buildDate,
      totalFloors: unitFromDb.building.totalFloors,
      propertyType: unitFromDb.building.propertyType,
    },

    // 部屋固有の画像と建物共通の画像を結合したもの
    allImages: allImages,

    // ユーザー固有の状態
    isFavorite: unitFromDb.favorites.some((fav) => fav.userId === userId),
    isInquiry: unitFromDb.inquiries.some((i) => i.userId === userId),
  };
}

interface GetUnitDetailParams {
  unitId: number;
  userId?: number | null; // ログインしていないユーザーも閲覧できるようオプショナルに
}

/**
 * IDに基づき、一件の物件（Unit）詳細情報を取得するサービス関数
 */
export async function getUnitById({
  unitId,
  userId,
}: GetUnitDetailParams): Promise<UnitDetail | null> {
  const unitFromDb = await prisma.unit.findUnique({
    where: {
      id: unitId,
    },
    ...unitDetailWithRelations, // 事前定義したincludeを適用
  });

  if (!unitFromDb) {
    return null;
  }

  // Prismaのデータをアプリケーション用の型に変換して返す
  return convertToUnitDetail(unitFromDb, userId);
}
