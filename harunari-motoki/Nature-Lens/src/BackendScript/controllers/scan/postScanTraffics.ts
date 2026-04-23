import { ScanAreaCalculation } from "../../service/scan/ScanAreaCalculation.js";
import { getAccessGBIF } from "../../models/scan/getAccessGBIF.js";
import { modifyGBIFData } from "../../service/scan/modifyAPIData.js";
import { scanedData } from "../../../library/scan/typeDeffinition.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { userGeolocationdata } from "../../../library/scan/typeDeffinition.js";

export const postScanTraffics = async function (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<scanedData> {
  const body = request.body as userGeolocationdata;
  const { latitude, longitude } = body;
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
      console.log("GBIFデータ編集前");
      const finalBioData = await modifyGBIFData(rawGBIFData);
      console.log("GBIFデータ編集後");
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
