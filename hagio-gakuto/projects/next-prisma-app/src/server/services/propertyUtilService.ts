import { prisma } from "@/lib/prisma";
import { PropertyFilters } from "@/types/PropertyFiltersType";
import { UnitSummary } from "@/types/PropertyType";
import { Prisma } from "@prisma/client";

// Unitを取得する際に含める関連モデルを定義
const unitWithRelations = Prisma.validator<Prisma.UnitDefaultArgs>()({
  include: {
    layout: true,
    building: {
      include: {
        propertyType: true,
        images: {
          where: { unitId: null }, // 建物共通の画像のみ
          orderBy: { id: "asc" },
          take: 1, // サムネイル用に1枚だけ取得
        },
      },
    },
    images: {
      orderBy: { id: "asc" },
      take: 1, // 部屋固有の画像を1枚取得
    },
    unitFeatures: {
      include: {
        feature: true,
      },
    },
    favorites: true,
    inquiries: true,
  },
});

// 上記の定義からPrismaのペイロード型を生成
export type PrismaUnitWithRelations = Prisma.UnitGetPayload<
  typeof unitWithRelations
>;

function formatAddress(...parts: (string | null | undefined)[]): string {
  // nullやundefined、空文字の要素を除外して結合する
  return parts.filter((part) => part).join("");
}

/**
 * Prismaから取得したUnitデータをアプリケーションで使いやすいUnitSummary形式に変換する
 */
export function convertToUnitSummary(
  unitFromDb: PrismaUnitWithRelations,
  userId?: number | null
): UnitSummary {
  // サムネイル画像を選択（部屋の画像があれば優先、なければ建物の画像）
  const thumbnail = unitFromDb.images[0] ?? unitFromDb.building.images[0];

  const address = formatAddress(
    unitFromDb.building.prefecture,
    unitFromDb.building.city,
    unitFromDb.building.town,
    unitFromDb.building.chome ? `${unitFromDb.building.chome}丁目` : null,
    unitFromDb.building.block
  );

  return {
    id: unitFromDb.id,
    priceRent: unitFromDb.priceRent,
    areaSqm: unitFromDb.areaSqm.toNumber(),
    floor: unitFromDb.floor,
    buildingName: unitFromDb.building.name,
    address: address,
    nearestStation: unitFromDb.building.nearestStation,
    walkToStation: unitFromDb.building.walkToStation,
    layout: unitFromDb.layout.name,
    buildDate: unitFromDb.building.buildDate,
    thumbnailUrl: thumbnail?.imageUrl ?? null,
    isFavorite: unitFromDb.favorites.some((fav) => fav.userId === userId),
    isInquiry: unitFromDb.inquiries.some((i) => i.userId === userId),
  };
}

/**
 * 絞り込み条件に基づき、データベースから物件リストを取得
 */
export async function getFilteredUnits(filters: PropertyFilters) {
  const {
    limit = 9,
    offset = 0,
    sortBy = "price_asc",
    userId = null,
  } = filters;

  const where = await buildWhereClause(filters);
  const orderBy = buildOrderByClause(sortBy);

  const [unitsFromDb, totalCount] = await prisma.$transaction([
    prisma.unit.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      ...unitWithRelations,
    }),
    prisma.unit.count({ where }),
  ]);

  const properties: UnitSummary[] = unitsFromDb.map((unit) =>
    convertToUnitSummary(unit, userId)
  );

  return { properties, count: totalCount };
}

function buildOrderByClause(
  sortBy: string
): Prisma.UnitOrderByWithRelationInput {
  switch (sortBy) {
    case "price_desc":
      return { priceRent: "desc" };
    case "area_desc":
      return { areaSqm: "desc" };
    case "age_asc": // 築浅順 = 建築日が新しい順
      return { building: { buildDate: "desc" } };
    case "price_asc":
    default:
      return { priceRent: "asc" };
  }
}

async function buildWhereClause(
  filters: PropertyFilters
): Promise<Prisma.UnitWhereInput> {
  const where: Prisma.UnitWhereInput = {};
  const {
    userId,
    favoritesOnly,
    inquiryOnly,
    withinNeighborhood,
    priceMin,
    priceMax,
    areaMin,
    ageMax,
    walkMax,
    floorMin,
    layouts,
    features,
  } = filters;

  // ユーザー固有フィルター
  if (favoritesOnly && userId) {
    where.favorites = { some: { userId } };
  }
  if (inquiryOnly && userId) {
    where.inquiries = { some: { userId } };
  }
  const buildingWhere: Prisma.BuildingWhereInput = {};

  if (withinNeighborhood) {
    const allowedAddresses = await prisma.rentAllowanceAddress.findMany({
      where: { workplaceId: 1 }, // 現状は固定
      select: { prefecture: true, city: true, town: true, chome: true },
    });

    if (allowedAddresses.length > 0) {
      buildingWhere.OR = allowedAddresses.map((addr) => ({
        prefecture: addr.prefecture,
        city: addr.city,
        town: addr.town,
        chome: addr.chome,
      }));
    } else {
      where.id = -1; // 対象住所がない場合、何も返さない
    }
  }

  if (walkMax) {
    buildingWhere.walkToStation = { lte: walkMax };
  }
  if (ageMax) {
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() - ageMax);
    buildingWhere.buildDate = { gte: targetDate };
  }
  if (Object.keys(buildingWhere).length > 0) {
    where.building = buildingWhere;
  }

  const priceFilter: Prisma.IntFilter = {};
  if (priceMin) priceFilter.gte = priceMin;
  if (priceMax) priceFilter.lte = priceMax;
  if (Object.keys(priceFilter).length > 0) {
    where.priceRent = priceFilter;
  }
  if (areaMin) where.areaSqm = { gte: areaMin };
  if (floorMin) where.floor = { gte: 2 };
  if (layouts && layouts.length > 0) {
    where.layout = { name: { in: layouts } };
  }
  if (features && features.length > 0) {
    where.unitFeatures = { some: { feature: { name: { in: features } } } };
  }
  return where;
}
