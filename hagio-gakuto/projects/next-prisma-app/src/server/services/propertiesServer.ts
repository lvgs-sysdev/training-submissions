import { promises as fs } from "fs";
import path from "path";
import { Property } from "@/types/PropertyType";
import { specifiedAddresses } from "@/utils/specifiedAddresses";

interface GetPropertiesParams {
  limit: number;
  offset: number;
  withinNeighborhood: boolean;
  sortBy: string;
}

export async function getProperties({
  limit,
  offset,
  withinNeighborhood,
  sortBy,
}: GetPropertiesParams): Promise<[Property[], number]> {
  const jsonPath = path.join(process.cwd(), "src", "properties.json");
  const fileContents = await fs.readFile(jsonPath, "utf8");
  const data = await JSON.parse(fileContents);

  // フィルタリング処理を追加
  const filteredData = withinNeighborhood
    ? data.filter(
        (property: Property) =>
          property.address.prefecture === "東京都" &&
          specifiedAddresses.some(
            (address) =>
              address.city === property.address.city &&
              address.streets.includes(property.address.street)
          )
      )
    : data;

  const sortedProperties = filteredData.sort((a: Property, b: Property) => {
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
  });

  return [
    sortedProperties.length,
    sortedProperties.slice(offset, offset + limit),
  ];
}
