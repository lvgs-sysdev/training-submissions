import {
  FinalScanResult,
  GeolocationAPIResponse,
} from "../../sharedObject/typeDeffinition.ts";
import { getAccessGeolocationAPI } from "./getAccessGeolocationAPI.ts";
import { userGeolocationdata } from "../../sharedObject/typeDeffinition.ts";
import { getScanedData } from "./getScanedData.ts";

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
      const scanedData = await getScanedData(URL, data);

      if (scanedData.status == "Applicable") {
        let returnItems: FinalScanResult = {
          status: "success",
          data: scanedData.data,
        };
        return returnItems;
      } else {
        let returnItems: FinalScanResult = {
          status: "failure",
          message: scanedData.message,
        };
        return returnItems;
      }
    } else {
      let responseItem: FinalScanResult = {
        status: "failure",
        message: GeolocationAPIAccessResult.message,
      };
      console.log("エラーメッセージalert前");
      return responseItem;
    }
  } catch (error) {
    let referenseItem: FinalScanResult = {
      status: "failure",
      message: "予期せぬエラーが発生しました（" + error + "）",
    };
    return referenseItem;
  }
}
