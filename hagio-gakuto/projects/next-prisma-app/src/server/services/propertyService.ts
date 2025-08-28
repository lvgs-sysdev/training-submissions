import { Property } from "@/types/PropertyType";
import { prisma } from "@/lib/prisma";

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

  if (!propertyFromDb) {
    return null;
  }

  const property: Property = {
    ...propertyFromDb,
    lat: propertyFromDb.lat.toNumber(),
    lng: propertyFromDb.lng.toNumber(),
    photos: propertyFromDb.propertyImages.map((image) => image.image_url),
    features: propertyFromDb.propertyFeature.map((feature) => feature.feature),
    isFavorite: propertyFromDb.favorites.length > 0,
    isInquiry: propertyFromDb.inquiries.length > 0,
    area_sqm: propertyFromDb.area_sqm.toNumber(),
  };

  return property;
}
