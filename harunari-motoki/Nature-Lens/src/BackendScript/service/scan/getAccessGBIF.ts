import axios from "axios";
import { GBIFOuterBox } from "../../../library/scan/typeDeffinition.js";

export async function getAccessGBIF(
  locationData: string,
): Promise<GBIFOuterBox> {
  try {
    const paramSetting = {
      geometry: locationData,
      hasCordinate: true,
      hasGeospatialIssue: false,
      limit: 100,
    };
    const response = await axios.get(
      "https://api.gbif.org/v1/occurrence/search?",
      {
        params: paramSetting,
        timeout: 10000,
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("タイムアウトしました。GBIF APIから応答がありません");
      throw new Error("通信がタイムアウトしました。");
    }
    throw error;
  }
}
