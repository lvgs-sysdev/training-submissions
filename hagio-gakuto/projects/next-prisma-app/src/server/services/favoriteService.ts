import { prisma } from "@/lib/prisma";
import { PropertyFilters } from "@/types/PropertyFiltersType";
import { UnitSummary } from "@/types/PropertyType";
import { getFilteredUnits } from "./propertyUtilService";

interface ToggleFavoriteParams {
  userId: number;
  unitId: number;
}

/**
 * 指定された物件（Unit）のお気に入り状態を切り替える（追加/削除）
 */
export async function toggleFavorite({ userId, unitId }: ToggleFavoriteParams) {
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_unitId: {
        // @@uniqueで設定した複合キーを使う
        userId,
        unitId,
      },
    },
  });

  if (existingFavorite) {
    // 存在する場合は削除
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    return { status: "removed" }; // 削除したことを返す
  } else {
    // 存在しない場合は作成
    await prisma.favorite.create({
      data: {
        userId,
        unitId,
      },
    });
    return { status: "added" }; // 追加したことを返す
  }
}

interface GetFavoriteUnitsParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  userId: number;
}

/**
 * ユーザーがお気に入り登録した物件（Unit）のみを取得する
 */
export async function getFavoriteProperties(
  params: GetFavoriteUnitsParams
): Promise<{ properties: UnitSummary[]; count: number }> {
  const filters: PropertyFilters = {
    ...params,
    favoritesOnly: true,
  };
  return getFilteredUnits(filters);
}
