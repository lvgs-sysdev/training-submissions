import { prisma } from "@/lib/prisma";
import { Property } from "@/types/PropertyType";
import { convertToAppProperty, filterProperties } from "./propertyUtilService";

interface Params {
  userId: number;
  propertyId: number;
}

export async function toggleFavorite({ userId, propertyId }: Params) {
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      user_id_property_id: {
        // @@uniqueで設定した複合キーを使う
        user_id: userId,
        property_id: propertyId,
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
        user_id: userId,
        property_id: propertyId,
      },
    });
    return { status: "added" }; // 追加したことを返す
  }
}

export async function getFavoriteStatus(
  userId: number,
  propertyId: number
): Promise<boolean> {
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      user_id_property_id: {
        user_id: userId,
        property_id: propertyId,
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
  const propertiesFromDb = await prisma.property.findMany({
    where: {
      favorites: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      propertyImages: true,
      propertyFeature: true,
      favorites: {
        where: {
          user_id: userId,
        },
      },
      inquiries: {
        where: {
          user_id: userId,
        },
      },
    },
  });

  if (!propertiesFromDb) {
    return null;
  }

  const properties: Property[] = propertiesFromDb.map(convertToAppProperty);

  return filterProperties({
    limit,
    offset,
    sortBy,
    withinNeighborhood,
    properties,
  });
}
