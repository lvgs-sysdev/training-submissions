import { promises as fs } from "fs";
import path from "path";
import { Property } from "@/types/PropertyType";

interface GetPropertiesParams {
  id: string | null;
}

export async function getPropertyById({
  id,
}: GetPropertiesParams): Promise<[Property[]]> {
  const jsonPath = path.join(process.cwd(), "src", "properties.json");
  const fileContents = await fs.readFile(jsonPath, "utf8");
  const data = await JSON.parse(fileContents);

  const filteredData = data.filter((property: Property) => property.id === id);

  return filteredData;
}
