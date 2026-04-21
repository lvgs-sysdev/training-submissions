import { accessStatus } from "@/library/users/typeDefinition.ts";
import { postUserInfo } from "../../APIservice/users/postUserInfo.ts";
import { correctLoginFormData } from "../../Utils/users/correctLoginFormData.ts";

export const loginTrafficControll = async () => {
  try {
    const data = await correctLoginFormData();
    const URL: string = "/api/login";
    console.log("loginTrafficControll データ送信関数postUserInfo利用前");
    const response: accessStatus = await postUserInfo(URL, data);
    console.log(
      "loginTrafficControll　サーバから帰ってきたデータの中身　statusが入っているはず",
      response,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
