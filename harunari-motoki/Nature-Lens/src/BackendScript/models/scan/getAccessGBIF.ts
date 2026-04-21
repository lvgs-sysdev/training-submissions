import axios from "axios";
import { GBIFOuterBox } from "../../../library/scan/typeDeffinition.ts";

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
    //設計思想:ユーザが知る必要がないエラー内容なのでthrowで処理
    if (error.code === "ECONNABORTED") {
      console.error("タイムアウトしました。GBIF APIから応答がありません");
      throw new Error("通信がタイムアウトしました。");
    }
    throw error;
  }
}
