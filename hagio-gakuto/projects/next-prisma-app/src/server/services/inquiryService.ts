import { prisma } from "@/lib/prisma";
import { Property } from "@/types/PropertyType";
import { convertToAppProperty, filterProperties } from "./propertyUtilService";

interface Params {
  userId: number;
  propertyIds: number[];
}

export async function postInquiry({ userId, propertyIds }: Params) {
  const dataToInsert = [];

  for (const id of propertyIds) {
    const isInquired = await getInquiryStatus(userId, id);
    if (!isInquired) {
      dataToInsert.push({
        user_id: userId,
        property_id: id,
      });
    }
  }

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
  const propertiesFromDb = await prisma.property.findMany({
    where: {
      inquiries: {
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

export async function getInquiryStatus(
  userId: number,
  propertyId: number
): Promise<boolean> {
  const existingInquiry = await prisma.inquiry.findUnique({
    where: {
      user_id_property_id: {
        user_id: userId,
        property_id: propertyId,
      },
    },
  });
  return !!existingInquiry; // !! でオブジェクトをbooleanに変換 (存在すればtrue, nullならfalse)
}
