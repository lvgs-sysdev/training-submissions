import axios from "axios";
import { authService } from "../../Services/users/authService.ts";
import { accessStatus } from "../../../library/users/typeDefinition.ts";

export const logoutTrafficControll = async () => {
  const token = authService.getAccessToken();
  console.log("メモリから入手したアクセストークン", token);
  if (!token) {
    throw new Error("You need to login");
  }
  try {
    console.log("axiosでログアウト処理送信前");
    console.log("アクセストークンの内容", token);
    const response = await axios.post(
      "/api/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      },
    );
    const deleteResult = response.data.status;
    console.log("アクセストークンの削除処理結果", deleteResult);

    const refDeleteCheck = authService.clearAccessToken();
    console.log("リフレッシュトークンの削除処理結果", refDeleteCheck);

    const result: accessStatus = {
      status: "success",
    };

    return result;
  } catch (error: any) {
    console.error("ログアウト処理エラー", error);
    throw new Error(error);
  }
};
