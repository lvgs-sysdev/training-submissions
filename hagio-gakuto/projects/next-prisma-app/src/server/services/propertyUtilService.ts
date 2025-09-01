import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Property } from "@/types/PropertyType";
import { PropertyFilters } from "@/types/PropertyFiltersType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const propertyWithRelations = Prisma.validator<Prisma.PropertyDefaultArgs>()({
  include: {
    propertyType: true,
    layout: true,
    features: true,
    propertyImages: true,
    favorites: true,
    inquiries: true,
  },
});

export type PrismaPropertyWithRelations = Prisma.PropertyGetPayload<
  typeof propertyWithRelations
>;

/**
 * Prismaから取得した物件データをアプリケーションで使う形式に変換するヘルパー関数
 */
export function convertToAppProperty(
  propertyFromDb: PrismaPropertyWithRelations
): Property {
  return {
    id: propertyFromDb.id,
    name: propertyFromDb.name,
    priceRent: propertyFromDb.priceRent,
    zip: propertyFromDb.zip,
    prefecture: propertyFromDb.prefecture,
    city: propertyFromDb.city,
    town: propertyFromDb.town,
    chome: propertyFromDb.chome,
    block: propertyFromDb.block,
    building: propertyFromDb.building,
    nearestStation: propertyFromDb.nearestStation,
    walkToStation: propertyFromDb.walkToStation,
    areaSqm: propertyFromDb.areaSqm.toNumber(),
    buildDate: propertyFromDb.buildDate,
    floor: propertyFromDb.floor,
    totalFloors: propertyFromDb.totalFloors,
    floorPlanUrl: propertyFromDb.floorPlanUrl,
    roomNumber: propertyFromDb.roomNumber,
    isEmpty: propertyFromDb.isEmpty,
    propertyType: propertyFromDb.propertyType,
    layout: propertyFromDb.layout,
    photos: propertyFromDb.propertyImages.map((image) => image.imageUrl),
    features: propertyFromDb.features.map((feature) => feature.name),
    isFavorite: propertyFromDb.favorites.length > 0,
    isInquiry: propertyFromDb.inquiries.length > 0,
  };
}

/**
 * orderBy句を構築するヘルパー関数
 */
function buildOrderByClause(
  sortBy: string
): Prisma.PropertyOrderByWithRelationInput {
  switch (sortBy) {
    case "price_desc":
      return { priceRent: "desc" };
    case "area_desc":
      return { areaSqm: "desc" };
    case "age_asc": // 築浅順 = 建築日が新しい順
      return { buildDate: "desc" };
    case "price_asc":
    default:
      return { priceRent: "asc" };
  }
}

/**
 * ユーザー固有のフィルター（お気に入り、問い合わせ済み）を適用する
 */
function applyUserFilters(
  where: Prisma.PropertyWhereInput,
  filters: Pick<PropertyFilters, "favoritesOnly" | "inquiryOnly" | "userId">
): void {
  const { favoritesOnly, inquiryOnly, userId } = filters;
  if (favoritesOnly && userId) {
    where.favorites = { some: { userId } };
  }
  if (inquiryOnly && userId) {
    where.inquiries = { some: { userId } };
  }
}

/**
 * 近隣地域フィルターを適用する (非同期)
 */
async function applyNeighborhoodFilter(
  where: Prisma.PropertyWhereInput,
  withinNeighborhood: boolean
): Promise<void> {
  if (!withinNeighborhood) return;

  const allowedAddresses = await prisma.rentAllowanceAddress.findMany({
    where: { workplaceId: 1 },
    select: { prefecture: true, city: true, town: true, chome: true },
  });

  if (allowedAddresses.length > 0) {
    where.OR = allowedAddresses.map((addr) => ({
      prefecture: addr.prefecture,
      city: addr.city,
      town: addr.town,
      chome: addr.chome,
    }));
  } else {
    // 対象住所がDBにない場合、結果が0件になるようにする
    where.id = -1;
  }
}

/**
 * 価格フィルターを適用する
 */
function applyPriceFilter(
  where: Prisma.PropertyWhereInput,
  filters: Pick<PropertyFilters, "priceMin" | "priceMax">
): void {
  const { priceMin, priceMax } = filters;
  const priceFilter: Prisma.IntFilter = {};
  if (priceMin) priceFilter.gte = priceMin;
  if (priceMax) priceFilter.lte = priceMax;

  if (Object.keys(priceFilter).length > 0) {
    where.priceRent = priceFilter;
  }
}

/**
 * 物件の属性フィルター（面積、築年数、駅徒歩、階数）を適用する
 */
function applyAttributeFilters(
  where: Prisma.PropertyWhereInput,
  filters: Pick<PropertyFilters, "areaMin" | "ageMax" | "walkMax" | "floorMin">
): void {
  if (filters.areaMin) where.areaSqm = { gte: filters.areaMin };
  if (filters.walkMax) where.walkToStation = { lte: filters.walkMax };
  if (filters.floorMin) where.floor = { gte: 2 };
  if (filters.ageMax) {
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() - filters.ageMax);
    where.buildDate = { gte: targetDate };
  }
}

/**
 * 関連テーブルのフィルター（間取り、設備）を適用する
 */
function applyRelationalFilters(
  where: Prisma.PropertyWhereInput,
  filters: Pick<PropertyFilters, "layouts" | "features">
): void {
  if (filters.layouts && filters.layouts.length > 0) {
    where.layout = { name: { in: filters.layouts } };
  }
  if (filters.features && filters.features.length > 0) {
    where.features = { some: { name: { in: filters.features } } };
  }
}

/**
 * where句を構築するヘルパー関数 (リファクタリング後)
 */
async function buildWhereClause(
  filters: PropertyFilters
): Promise<Prisma.PropertyWhereInput> {
  const where: Prisma.PropertyWhereInput = {};
  const { withinNeighborhood = false } = filters;

  // 各フィルターを適用するヘルパー関数を呼び出す
  applyUserFilters(where, filters);
  await applyNeighborhoodFilter(where, withinNeighborhood);
  applyPriceFilter(where, filters);
  applyAttributeFilters(where, filters);
  applyRelationalFilters(where, filters);

  return where;
}

/**
 * 絞り込み条件に基づき、データベースから物件リストを取得・変換するメイン関数
 */
export async function getFilteredProperties(filters: PropertyFilters) {
  const {
    limit = 9,
    offset = 0,
    sortBy = "price_asc",
    userId = null,
  } = filters;

  const where = await buildWhereClause(filters);
  const orderBy = buildOrderByClause(sortBy);

  const [propertiesFromDb, totalCount] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        layout: true,
        propertyType: true,
        propertyImages: true,
        features: true,
        favorites: {
          where: {
            userId: userId || undefined,
          },
        },
        inquiries: {
          where: {
            userId: userId || undefined,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  const properties: Property[] = (
    propertiesFromDb as PrismaPropertyWithRelations[]
  ).map(convertToAppProperty);

  return { properties, count: totalCount };
}
