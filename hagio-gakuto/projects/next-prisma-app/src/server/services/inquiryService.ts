import { prisma } from "@/lib/prisma";

import { PropertyFilters } from "@/types/PropertyFiltersType";
import { UnitSummary } from "@/types/PropertyType";
import { getFilteredUnits } from "./propertyUtilService";
import { InquiryPropertySchema } from "@/lib/validators/inquiryPropertyValidator";
import z from "zod";

type InquiryPropertyData = z.infer<typeof InquiryPropertySchema>;

export async function postInquiry(userId: number, data: InquiryPropertyData) {
  const { inquiryCategoryId, unitIds } = data;
  const dataToInsert = [];

  for (const id of unitIds) {
    const isInquired = await getInquiryStatus(userId, id);
    if (!isInquired) {
      dataToInsert.push({
        userId: userId,
        unitId: id,
        inquiryCategoryId: inquiryCategoryId,
      });
    }
  }

  console.log(dataToInsert);

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
): Promise<{ properties: UnitSummary[]; count: number }> {
  const filters: PropertyFilters = {
    ...params,
    inquiryOnly: true,
  };

  return getFilteredUnits(filters);
}

async function getInquiryStatus(
  userId: number,
  propertyId: number
): Promise<boolean> {
  const existingInquiry = await prisma.inquiry.findFirst({
    where: {
      userId,
      unitId: propertyId,
    },
  });
  return !!existingInquiry; // !! でオブジェクトをbooleanに変換 (存在すればtrue, nullならfalse)
}
