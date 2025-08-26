import { prisma } from "@/lib/prisma";
import { Property } from "@/types/PropertyType";
import { specifiedAddresses } from "@/utils/specifiedAddresses";
import { getAllProperties } from "./fetchPropertyService";

interface Params {
  userId: number;
  propertyId: string;
}

export async function toggleFavorite({ userId, propertyId }: Params) {
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        // @@uniqueで設定した複合キーを使う
        userId: userId,
        propertyId: propertyId,
      },
    },
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    return { status: "removed" }; // 削除したことを返す
  } else {
    await prisma.favorite.create({
      data: {
        userId: userId,
        propertyId: propertyId,
      },
    });
    return { status: "added" }; // 追加したことを返す
  }
}

export async function getFavoriteStatus(
  userId: number,
  propertyId: string
): Promise<boolean> {
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: userId,
        propertyId: propertyId,
      },
    },
  });
  return !!existingFavorite; // !! でオブジェクトをbooleanに変換 (存在すればtrue, nullならfalse)
}

interface GetPropertiesParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  userId: number;
}

export async function getFavoriteProperties({
  limit,
  offset,
  sortBy,
  withinNeighborhood,
  userId,
}: GetPropertiesParams) {
  const allProperties = await getAllProperties();

  const favoriteRecords = await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
  });

  const favoritePropertyIds = new Set(
    favoriteRecords.map((fav) => fav.propertyId)
  );

  const favoriteProperties = allProperties.filter((property) =>
    favoritePropertyIds.has(property.id)
  );

  let filteredProperties = withinNeighborhood
    ? favoriteProperties.filter(
        (property: Property) =>
          property.prefecture === "東京都" &&
          specifiedAddresses.some(
            (address) =>
              address.city === property.city &&
              address.streets.includes(property.street)
          )
      )
    : favoriteProperties;

  const totalCount = filteredProperties.length;

  const sortedProperties = filteredProperties.toSorted(
    (a: Property, b: Property) => {
      switch (sortBy) {
        case "price_desc":
          return b.price_rent - a.price_rent;
        case "area_desc":
          return b.area_sqm - a.area_sqm;
        case "age_asc":
          return a.age_years - b.age_years;
        case "price_asc":
        default:
          return a.price_rent - b.price_rent;
      }
    }
  );

  const paginatedProperties = sortedProperties.slice(offset, offset + limit);

  return { properties: paginatedProperties, count: totalCount };
}
