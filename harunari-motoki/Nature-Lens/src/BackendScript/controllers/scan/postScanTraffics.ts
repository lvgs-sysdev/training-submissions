import { scanareaCalculation } from "../../service/scan/scanareaCalculation.js";
import { getAccessGBIF } from "../../service/scan/getAccessGBIF.js";
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
  try {
    const polygonData = await scanareaCalculation({ latitude, longitude });

    const rawGBIFData = await getAccessGBIF(polygonData);

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
      return scanedData;
    }
  } catch (error: any) {
    request.log.error(
      { error: error },
      "バケツリレーの途中でエラーが発生しました。",
    );
    console.error("サーバでエラーがありました 再度実行してください");
    return reply
      .status(500)
      .send({ error: "サーバでエラーがありました 再度実行してください" });
  }
};
