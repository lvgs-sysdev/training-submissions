import {
  FinalScanResult,
  GeolocationAPIResponse,
  scanedData,
} from "../../sharedObject/typeDiffinition.ts";
import { getAccessGeolocationAPI } from "./getAccessGeolocationAPI.ts";
import { Location } from "../../sharedObject/typeDiffinition.ts";
import axios from "axios";

export async function ClientSideControl() {
  try {
    const GeolocationAPIAccessResult: GeolocationAPIResponse =
      await getAccessGeolocationAPI();
    if (GeolocationAPIAccessResult.status === "success") {
      const data: Location = {
        latitude: GeolocationAPIAccessResult.data.latitude,
        longitude: GeolocationAPIAccessResult.data.longitude,
      };
      const url: string = "/scanResult";
      try {
        const scanedData: scanedData = await axios.post(url, data);
        if (scanedData.status === "NotApplicable") {
          console.log("viewmodelに該当なしを送信");
          let responseItem: FinalScanResult = {
            status: "failure",
            message: scanedData.message,
          };
          return responseItem;
        } else {
          console.log("viewmodelに該当データ送信");
          let responseItem: FinalScanResult = {
            status: "success",
            data: scanedData.data,
          };
          return responseItem;
        }
      } catch (error: any) {
        let responseItem: FinalScanResult = {
          status: "failure",
          message: "サーバからデータを取得できませんでした。",
        };
        return responseItem;
      }
    } else {
      let responseItem: FinalScanResult = {
        status: "failure",
        message: GeolocationAPIAccessResult.message,
      };
      return responseItem;
    }
  } catch (error) {
    let responseItem: FinalScanResult = {
      status: "failure",
      message: "サーバにアクセスできませんでした",
    };
    return responseItem;
  }
}
