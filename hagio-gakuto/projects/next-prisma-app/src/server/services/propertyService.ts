import { Property } from "@/types/PropertyType";
import { prisma } from "@/lib/prisma";
import {
  convertToAppProperty,
  PrismaPropertyWithRelations,
} from "./propertyUtilService";

interface GetPropertiesParams {
  id: number;
  userId: number;
}

export async function getPropertyById({
  id,
  userId,
}: GetPropertiesParams): Promise<Property | null> {
  const propertyFromDb = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      layout: true,
      propertyType: true,
      propertyImages: true,
      features: true,
      favorites: {
        where: {
          userId: userId,
        },
      },
      inquiries: {
        where: {
          userId: userId,
        },
      },
    },
  });

  if (!propertyFromDb) {
    return null;
  }

  const property: Property = convertToAppProperty(
    propertyFromDb as PrismaPropertyWithRelations
  );
  return property;
}
