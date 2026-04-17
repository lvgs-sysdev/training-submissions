import {
  accessStatus,
  userInfo,
} from "../../../library/users/typeDefinition.ts";
import axios from "axios";

export const postUserInfo = async (URL: string, data: userInfo) => {
  try {
    console.log("クライアントからのaxios実行前");
    console.log("送るデータ", data);
    const response = await axios.post(URL, data, { timeout: 100000 });
    const result: accessStatus = response.data;
    console.log(
      "postUserInfo　サーバから帰ってきたデータの中身　statusが入っているはず",
      response.data,
    );

    return result;
  } catch (error: any) {
    console.error("send error", error.response.data);
    throw error;
  }
};
