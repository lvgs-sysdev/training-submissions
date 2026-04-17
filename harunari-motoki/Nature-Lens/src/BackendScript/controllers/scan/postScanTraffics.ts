import { ScanAreaCalculation } from "../../service/scan/ScanAreaCalculation.ts";
import { getAccessGBIF } from "../../models/scan/getAccessGBIF.ts";
import { modifyGBIFData } from "../../service/scan/modifyAPIData.ts";
import { scanedData } from "../../../library/scan/typeDeffinition.ts";

export const postScanpTraffics = async function (
  request,
  reply,
): Promise<scanedData> {
  const { latitude, longitude } = request.body;
  console.log("クライアントからのデータ受け取り完了");
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
      console.log(scanedData);
      return scanedData;
    } else {
      const finalBioData = await modifyGBIFData(rawGBIFData);
      const scanedData: scanedData = {
        status: "Applicable",
        data: finalBioData,
        message: "該当データあり",
      };
      console.log(scanedData);
      return scanedData;
    }
  } catch (error: any) {
    request.log.error(
      { error: error },
      "バケツリレーの途中でエラーが発生しました。",
    );
    console.log("サーバでエラーがありました 再度実行してください");
    return reply
      .status(500)
      .send({ error: "サーバでエラーがありました 再度実行してください" });
  }
};
