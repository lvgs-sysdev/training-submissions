import {
  FinalScanResult,
  GeolocationAPIResponse,
  scanedData,
} from "../../../library/scan/typeDeffinition.ts";
import { getAccessGeolocationAPI } from "../../APIservice/scan/getAccessGeolocationAPI.ts";
import { userGeolocationdata } from "../../../library/scan/typeDeffinition.ts";
import { postAxiosserver } from "../../APIservice/scan/postAxiosserver.ts";

//GeolocationAPIが使えないので、特定の座標を返す関数に差し替え

export async function ClientSideControl() {
  try {
    const data: userGeolocationdata = {
      latitude: 35,
      longitude: 139,
    };

    const URL: string = "/scanResult";
    console.log("偽位置情報をサーバに送る直前");
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
  } catch (error) {
    const returnItems: FinalScanResult = {
      status: "failure",
      message: "予期せぬエラーが発生しました（" + error + "）",
    };
    console.log(returnItems);
    return returnItems;
  }
}
