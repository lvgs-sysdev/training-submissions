import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { specifiedAddresses } from "@/utils/specifiedAddresses";
import { Property } from "@/types/PropertyType";
import { convertToAppProperty } from "./propertyUtilService";

// フィルターの型定義
export interface Filters {
  priceMin?: string;
  priceMax?: string;
  area?: string;
  age?: string;
  floor?: string;
  layouts?: string[];
  walk?: string;
}

// パラメータ全体の型定義
interface GetPropertiesParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  filters: Filters; // ★修正点1: 正しい型を指定
}

// where句を構築するヘルパー関数
function buildWhereClause(
  filters: Filters,
  withinNeighborhood: boolean
): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};
  if (withinNeighborhood) {
    where.prefecture = "東京都";
    where.OR = specifiedAddresses.map((addr) => ({
      city: addr.city,
      street: { in: addr.streets },
    }));
  }

  const priceFilter: Prisma.IntFilter = {};
  if (filters.priceMin) priceFilter.gte = Number(filters.priceMin);
  if (filters.priceMax) priceFilter.lte = Number(filters.priceMax);
  if (Object.keys(priceFilter).length > 0) where.price_rent = priceFilter;
  if (filters.area) where.area_sqm = { gte: Number(filters.area) };
  if (filters.age) where.age_years = { lte: Number(filters.age) };
  if (filters.walk) where.walk_to_station = { lte: Number(filters.walk) };
  if (filters.floor === "true") where.floor = { gte: 2 };
  if (
    Array.isArray(filters.layouts) &&
    filters.layouts.length > 0 &&
    filters.layouts[0] !== ""
  ) {
    where.layout = { in: filters.layouts };
  }

  return where;
}

// orderBy句を構築するヘルパー関数
function buildOrderByClause(
  sortBy: string
): Prisma.PropertyOrderByWithRelationInput {
  switch (sortBy) {
    case "price_desc":
      return { price_rent: "desc" };
    case "area_desc":
      return { area_sqm: "desc" };
    case "age_asc":
      return { age_years: "asc" };
    case "price_asc":
    default:
      return { price_rent: "asc" };
  }
}

// メインの関数
export async function getProperties({
  limit,
  offset,
  sortBy,
  filters,
  withinNeighborhood,
}: GetPropertiesParams) {
  const where = buildWhereClause(filters, withinNeighborhood);
  const orderBy = buildOrderByClause(sortBy);

  const [propertiesFromDb, count] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        propertyImages: true,
        propertyFeature: true,
        favorites: true,
        inquiries: true,
      },
    }),
    prisma.property.count({ where }),
  ]);

  const properties: Property[] = propertiesFromDb.map(convertToAppProperty);

  return { properties, count };
}
