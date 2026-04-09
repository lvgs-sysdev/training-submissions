import {
  GBIFdetailInfo,
  locationResponse,
  scanedData,
} from "../../sharedObject/typeDiffinition.ts";
import { getAccessGeolocationAPI } from "./getAccessGeolocationAPI.ts";
import { Location } from "../../sharedObject/typeDiffinition.ts";
import axios from "axios";

const scanButton = document.querySelector(".scan_button");
if (!scanButton) {
  // 【オプション】サーバサイドにログを送りたい
  alert("システムエラーです。");
} else {
  scanButton.addEventListener("click", async (_) => {
    try {
      const UserCurrentLocation: locationResponse =
        await getAccessGeolocationAPI();
      if (UserCurrentLocation.status === "success") {
        const data: Location = {
          latitude: UserCurrentLocation.data.latitude,
          longitude: UserCurrentLocation.data.longitude,
        };
        const url: string = "/scanResult";
        try {
          const response: scanedData = await axios.post(url, data);
          if (response.status === "NotApplicable") {
            let message: string = response.message;
            console.log("viewmodelに該当なしを送信");
            return message;
          } else {
            const data: GBIFdetailInfo[] = response.data;
            console.log("viewmodelに該当データ送信");
            return data;
          }
        } catch (error: any) {
          alert("サーバからデータを取得できませんでした。");
        }
      } else {
        let message = UserCurrentLocation.message;
        alert(message);
      }
    } catch (error) {
      alert("処理が正常に終了しませんでした。再度実行してください。");
    }
  });
}
