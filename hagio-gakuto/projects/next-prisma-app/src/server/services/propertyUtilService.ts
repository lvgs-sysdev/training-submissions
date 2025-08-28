import { prisma } from "@/lib/prisma";
import { PropertyFeature } from "@/types/PropertyFeatureType";
import { PropertyImage } from "@/types/PropertyImageType";
import { Property as PropertyType } from "@/types/PropertyType";
import { specifiedAddresses } from "@/utils/specifiedAddresses";
import { Prisma } from "@prisma/client";

export async function getAllProperties(): Promise<PropertyType[]> {
  const propertiesFromDb = await prisma.property.findMany({
    include: {
      propertyImages: true,
      propertyFeature: true,
    },
  });

  // Prismaのデータ形式を、アプリケーションで使うPropertyTypeの形式に変換
  const allProperties: PropertyType[] = propertiesFromDb.map((property) => {
    return {
      ...property,
      photos: property.propertyImages.map((image) => image.image_url),
      features: property.propertyFeature.map((feature) => feature.feature),
      lat: property.lat.toNumber(),
      lng: property.lng.toNumber(),
      area_sqm: property.area_sqm.toNumber(),
    };
  });
  return allProperties;
}

interface FilterPropertiesParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  properties: PropertyType[];
}

/**
 * 物件リストの絞り込み、並び替え、ページネーションを行う
 * @param {FilterPropertiesParams} params - フィルタリングとページネーションのパラメータ
 * @returns {{properties: PropertyType[], count: number}} - 処理後の物件リストと総件数
 */
export async function filterProperties({
  limit,
  offset,
  sortBy,
  withinNeighborhood,
  properties,
}: FilterPropertiesParams) {
  const filteredProperties = withinNeighborhood
    ? properties.filter(
        (property: PropertyType) =>
          property.prefecture === "東京都" &&
          specifiedAddresses.some(
            (address) =>
              address.city === property.city &&
              address.streets.includes(property.street)
          )
      )
    : properties;

  const totalCount = filteredProperties.length;

  const sortedProperties = filteredProperties.toSorted(
    (a: PropertyType, b: PropertyType) => {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const propertyWithRelations = Prisma.validator<Prisma.PropertyFindManyArgs>()({
  include: {
    propertyImages: true,
    propertyFeature: true,
    favorites: true,
    inquiries: true,
  },
});

type PrismaPropertyWithRelations = Prisma.PropertyGetPayload<
  typeof propertyWithRelations
>;

/**
 * Prismaから取得した物件データをアプリケーションで使う形式に変換する
 * @param {PrismaPropertyWithRelations} propertyFromDb - Prismaから取得した単一の物件データ
 * @returns {Property} - アプリケーションで使う形式に変換された物件データ
 */
export function convertToAppProperty(
  propertyFromDb: PrismaPropertyWithRelations
): PropertyType {
  const property: PropertyType = {
    ...propertyFromDb,
    lat: propertyFromDb.lat.toNumber(),
    lng: propertyFromDb.lng.toNumber(),
    photos: propertyFromDb.propertyImages.map(
      (image: PropertyImage) => image.image_url
    ),
    features: propertyFromDb.propertyFeature.map(
      (feature: PropertyFeature) => feature.feature
    ),
    isFavorite: propertyFromDb.favorites?.length > 0,
    isInquiry: propertyFromDb.inquiries?.length > 0,
    area_sqm: propertyFromDb.area_sqm.toNumber(),
  };

  return property;
}
