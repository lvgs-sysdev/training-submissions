import { authService } from "../../Services/users/authService.ts";
import {
  userGeolocationdata,
  scanedData,
} from "../../../library/scan/typeDeffinition.ts";
import axios from "axios";

export async function postAxiosserver(URL: string, data: userGeolocationdata) {
  const token = authService.getAccessToken();
  console.log("tokenが入手できていない可能性", token);
  if (!token) {
    throw new Error("you need to login!");
  }
  try {
    console.log("axiosで送信前");
    console.log("URLと", URL, "data", data);
    const response = await axios.post(URL, data, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    const scanedData: scanedData = response.data;
    console.log("サーバから受け取ったレスポンス", scanedData);
    return scanedData;
  } catch (error: any) {
    throw new Error("error");
  }
}
