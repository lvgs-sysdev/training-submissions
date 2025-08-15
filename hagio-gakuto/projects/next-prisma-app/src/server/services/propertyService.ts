import { Property } from "@/types/PropertyType";
import { getFavoriteStatus } from "./favoriteService";
import { getAllProperties } from "./fetchPropertyService";

interface GetPropertiesParams {
  id: string;
  userId: number;
}

export async function getPropertyById({
  id,
  userId,
}: GetPropertiesParams): Promise<Property | undefined> {
  const allProperties = await getAllProperties();

  const filteredData = allProperties.find(
    (property: Property) => property.id === id
  );

  if (!filteredData) {
    return undefined;
  }

  const isFavorite = await getFavoriteStatus(userId, id);

  if (isFavorite) {
    filteredData.isFavorite = true;
  } else {
    filteredData.isFavorite = false;
  }

  return filteredData;
}
