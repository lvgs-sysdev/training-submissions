import { prisma } from "@/lib/prisma";
import { Property } from "@/types/PropertyType";
import { getAllProperties } from "./fetchPropertyService";
import { specifiedAddresses } from "@/utils/specifiedAddresses";

interface Params {
  userId: number;
  propertyIds: string[];
}

export async function postInquiry({ userId, propertyIds }: Params) {
  const dataToInsert = [];

  for (const id of propertyIds) {
    const isInquired = await getInquiryStatus(userId, id);
    if (!isInquired) {
      dataToInsert.push({
        userId: userId,
        propertyId: id,
      });
    }
  }

  // 5. 挿入すべきデータがあれば、createManyを実行
  if (dataToInsert.length > 0) {
    await prisma.inquiry.createMany({
      data: dataToInsert,
    });
  }
}

interface GetPropertiesParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  userId: number;
}
export async function getInquiryProperties({
  limit,
  offset,
  sortBy,
  withinNeighborhood,
  userId,
}: GetPropertiesParams) {
  const allProperties = await getAllProperties();

  const inquiryRecords = await prisma.inquiry.findMany({
    where: {
      userId: userId,
    },
  });

  const favoritePropertyIds = new Set(
    inquiryRecords.map((inq) => inq.propertyId)
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

export async function getInquiryStatus(
  userId: number,
  propertyId: string
): Promise<boolean> {
  const existingInquiry = await prisma.inquiry.findUnique({
    where: {
      userId_propertyId: {
        userId: userId,
        propertyId: propertyId,
      },
    },
  });
  return !!existingInquiry; // !! でオブジェクトをbooleanに変換 (存在すればtrue, nullならfalse)
}
