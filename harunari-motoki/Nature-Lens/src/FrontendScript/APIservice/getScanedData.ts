import {
  userGeolocationdata,
  scanedData,
} from "../../sharedObject/typeDeffinition.ts";
import axios from "axios";

export async function getScanedData(URL: string, data: userGeolocationdata) {
  try {
    const response = await axios.post(URL, data);
    const scanedData: scanedData = response.data;
    return scanedData;
  } catch (error: any) {
    throw new Error("error");
  }
}
