import { authService } from "../../Services/users/authService.js";
import axios from "axios";

export const postSilentRefresh = async () => {
  try {
    console.log("ppostSilentRefresh.ts. /refreshにリフレッシュ依頼を送信前");
    const response = await axios.post("/refresh", { timeout: 100000 });
    console.log("postSilentRefreshが受け取ったresponseの中身", response);
    if (response.data.status === "success") {
      const accessToken = response.data.token;
      console.log("setAccessTokenに渡すデータが適切なのか確認", accessToken);
      authService.setAccessToken(accessToken);
      console.log("Refresh Login Status Success", accessToken);
    }
  } catch (error) {
    console.log("Refresh Login Status Failure");
  }
};
