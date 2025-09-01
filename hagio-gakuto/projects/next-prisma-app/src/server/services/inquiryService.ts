import { prisma } from "@/lib/prisma";
import { Property } from "@/types/PropertyType";
import { getFilteredProperties } from "./propertyUtilService";
import { PropertyFilters } from "@/types/PropertyFiltersType";

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
        userId: userId,
        propertyId: id,
      });
    }
  }

  if (dataToInsert.length > 0) {
    await prisma.inquiry.createMany({
      data: dataToInsert,
    });
  }
}

interface GetInquiryPropertiesParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  userId: number;
}

/**
 * ユーザーがお問い合わせした物件のみを取得する
 */
export async function getInquiryProperties(
  params: GetInquiryPropertiesParams
): Promise<{ properties: Property[]; count: number }> {
  const filters: PropertyFilters = {
    ...params,
    inquiryOnly: true,
  };
  return getFilteredProperties(filters);
}

export async function getInquiryStatus(
  userId: number,
  propertyId: number
): Promise<boolean> {
  const existingInquiry = await prisma.inquiry.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });
  return !!existingInquiry; // !! でオブジェクトをbooleanに変換 (存在すればtrue, nullならfalse)
}
