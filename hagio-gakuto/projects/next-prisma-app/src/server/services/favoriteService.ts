import { prisma } from "@/lib/prisma";
import { Property } from "@/types/PropertyType";
import { getFilteredProperties } from "./propertyUtilService";
import { PropertyFilters } from "@/types/PropertyFiltersType";

interface Params {
  userId: number;
  propertyId: number;
}

export async function toggleFavorite({ userId, propertyId }: Params) {
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        // @@uniqueで設定した複合キーを使う
        userId,
        propertyId,
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
        userId,
        propertyId,
      },
    });
    return { status: "added" }; // 追加したことを返す
  }
}

interface GetFavoritePropertiesParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  userId: number;
}

/**
 * ユーザーがお気に入り登録した物件のみを取得する
 */
export async function getFavoriteProperties(
  params: GetFavoritePropertiesParams
): Promise<{ properties: Property[]; count: number }> {
  const filters: PropertyFilters = {
    ...params,
    favoritesOnly: true,
  };
  return getFilteredProperties(filters);
}
