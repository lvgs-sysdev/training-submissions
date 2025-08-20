import { Property } from "@/types/PropertyType";
import { promises as fs } from "fs";
import path from "path";

export async function getAllProperties(): Promise<Property[]> {
  const jsonPath = path.join(process.cwd(), "src", "properties.json");
  const fileContents = await fs.readFile(jsonPath, "utf8");
  const allProperties = JSON.parse(fileContents);

  return allProperties;
}
