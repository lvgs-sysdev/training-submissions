import {
  FinalScanResult,
  GeolocationAPIResponse,
  scanedData,
} from "../../../library/scan/typeDeffinition.ts";
import { getAccessGeolocationAPI } from "../../APIservice/scan/getAccessGeolocationAPI.ts";
import { userGeolocationdata } from "../../../library/scan/typeDeffinition.ts";
import { postAxiosserver } from "../../APIservice/scan/postAxiosserver.ts";

export async function ClientSideControl() {
  try {
    const GeolocationAPIAccessResult: GeolocationAPIResponse =
      await getAccessGeolocationAPI();
    if (GeolocationAPIAccessResult.status === "success") {
      const data: userGeolocationdata = {
        latitude: GeolocationAPIAccessResult.data.latitude,
        longitude: GeolocationAPIAccessResult.data.longitude,
      };
      const URL: string = "/scanResult";

      const scanedData: scanedData = await postAxiosserver(URL, data);

      if (scanedData.status == "Applicable") {
        let returnItems: FinalScanResult = {
          status: "success",
          data: scanedData.data,
        };
        console.log(returnItems);
        return returnItems;
      } else {
        let returnItems: FinalScanResult = {
          status: "failure",
          message: scanedData.message,
        };
        console.log(returnItems);
        return returnItems;
      }
    } else {
      const { errorDetail } = GeolocationAPIAccessResult;
      let rturnItem: FinalScanResult = {
        status: "failure",
        message: "",
      };
      if (errorDetail == 1) {
        rturnItem = {
          status: "failure",
          message: "位置情報の利用が許可されていません。設定を許可してください",
        };
      }
      if (errorDetail == 2) {
        rturnItem = {
          status: "failure",
          message:
            "位置情報を特定できません。電波のよう場所で再度実行してください",
        };
      }
      if (errorDetail == 3) {
        rturnItem = {
          status: "failure",
          message: "タイムアウトです。電波のよう場所で再度実行してください",
        };
      }
      if (!errorDetail) {
        rturnItem = {
          status: "failure",
          message: "原因不明のエラーです。",
        };
      }
      console.log("エラーメッセージalert前");
      console.log(rturnItem);
      return rturnItem;
    }
  } catch (error) {
    const referenseItem: FinalScanResult = {
      status: "failure",
      message: "予期せぬエラーが発生しました（" + error + "）",
    };
    console.log(referenseItem);
    return referenseItem;
  }
}
