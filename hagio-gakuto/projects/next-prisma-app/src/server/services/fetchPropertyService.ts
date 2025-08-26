import { prisma } from "@/lib/prisma";
import { Property as PropertyType } from "@/types/PropertyType";



export async function getAllProperties(): Promise<PropertyType[]> {
  // const jsonPath = path.join(process.cwd(), "src", "properties.json");
  // const fileContents = await fs.readFile(jsonPath, "utf8");
  // const allProperties = JSON.parse(fileContents);

      
  const allProperties = await prisma.property.findMany();

    
  return allProperties;

}
