import { ScanAreaCalculation } from "../../BackendScript/service/ScanAreaCalculation";
import { getAccessGBIF } from "../models/getAccessGBIF";
import { modifyGBIFData } from "../service/modifyAPIData";
import { scanedData } from "@/sharedObject/typeDiffinition";

export const scanPost = async function (request, reply): Promise<scanedData> {
  const { latitude, longitude } = request.body;
  try {
    const polygonData = await ScanAreaCalculation({ latitude, longitude });
    console.log("ポリゴン正常に出力完了");

    const rawGBIFData = await getAccessGBIF(polygonData);
    console.log("GBIF生データ取得完了");

    if (rawGBIFData.count <= 0) {
      const scanedData: scanedData = {
        status: "NotApplicable",
        message: "該当データなし",
      };
      console.log("該当なしデータ送信");
      return scanedData;
    } else {
      const finalBioData = await modifyGBIFData(rawGBIFData);
      console.log("GBIFデータ修正完了");

      const scanedData: scanedData = {
        status: "Applicable",
        data: finalBioData,
        message: "該当データあり",
      };
      return scanedData;
    }
  } catch (error: any) {
    request.log.error(
      { error: error },
      "バケツリレーの途中でエラーが発生しました。",
    );
    return reply
      .status(500)
      .send({ error: "サーバでエラーがありました 再度実行してください" });
  }
};
