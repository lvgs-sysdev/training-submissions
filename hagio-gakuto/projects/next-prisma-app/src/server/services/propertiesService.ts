import { Property } from "@/types/PropertyType";
import { specifiedAddresses } from "@/utils/specifiedAddresses";
import { getAllProperties } from "./fetchPropertyService";

interface GetPropertiesParams {
  limit: number;
  offset: number;
  sortBy: string;
  withinNeighborhood: boolean;
  filters: { [key: string]: any };
}

export async function getProperties({
  limit,
  offset,
  sortBy,
  filters,
  withinNeighborhood,
}: GetPropertiesParams) {
  const allProperties = await getAllProperties();

  let filteredProperties = withinNeighborhood
    ? allProperties.filter(
        (property: Property) =>
          property.address.prefecture === "東京都" &&
          specifiedAddresses.some(
            (address) =>
              address.city === property.address.city &&
              address.streets.includes(property.address.street)
          )
      )
    : allProperties;

  // --- 全てのフィルター処理 ---
  if (filters.priceMin && filters.priceMin !== "") {
    filteredProperties = filteredProperties.filter(
      (p: Property) => p.price_rent >= parseInt(filters.priceMin)
    );
  }
  if (filters.priceMax && filters.priceMax !== "") {
    filteredProperties = filteredProperties.filter(
      (p: Property) => p.price_rent <= parseInt(filters.priceMax)
    );
  }
  if (filters.area) {
    filteredProperties = filteredProperties.filter(
      (p: Property) => p.area_sqm >= parseInt(filters.area)
    );
  }
  if (filters.walk && filters.walk !== "") {
    const walkRegex = /徒歩(\d+)分/;
    filteredProperties = filteredProperties.filter((p: Property) => {
      const match = walkRegex.exec(p.nearest_station);
      const walkTime = parseInt(match?.[1] || "99");
      return walkTime <= parseInt(filters.walk);
    });
  }
  if (filters.age && filters.age !== "") {
    filteredProperties = filteredProperties.filter(
      (p: Property) => p.age_years <= parseInt(filters.age)
    );
  }
  if (filters.floor && filters.floor === "true") {
    // チェックボックスの値は文字列の'true'
    filteredProperties = filteredProperties.filter(
      (p: Property) => p.floor >= 2
    );
  }
  if (
    filters.layouts &&
    filters.layouts.length > 0 &&
    filters.layouts[0] !== ""
  ) {
    filteredProperties = filteredProperties.filter((p: Property) =>
      filters.layouts.includes(p.layout)
    );
  }

  const totalCount = filteredProperties.length;

  // ★ .sort() から .toSorted() に変更
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
