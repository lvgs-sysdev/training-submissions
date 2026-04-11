import axios from "axios";
import { GBIFOuterBox } from "../../sharedObject/typeDeffinition.ts";

export async function getAccessGBIF(
  locationData: string,
): Promise<GBIFOuterBox> {
  try {
    const paramSetting = {
      geometry: locationData,
      limit: 2,
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

//テストコード
// cd ../../models/
// npx tsx ./getAccessGBIF.ts
// const testArea: string =
//   "POLYGON((139.80595930100347 35.70046691514662,139.80332326203416 35.7068308761773,139.79695930100348 35.70946691514662,139.7905953399728 35.7068308761773,139.7879593010035 35.70046691514662,139.7905953399728 35.69410295411594,139.79695930100348 35.69146691514662,139.80332326203416 35.69410295411594,139.80595930100347 35.70046691514662))";
// getAccessGBIF(testArea);
//POLAから半径１キロにドバトがいる！！
