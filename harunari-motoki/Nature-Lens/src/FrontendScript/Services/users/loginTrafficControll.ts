import { accessStatus } from "../../../library/users/typeDefinition.js";
import { postUserInfo } from "../../APIservice/users/postUserInfo.js";
import { correctLoginFormData } from "../../Utils/users/correctLoginFormData.js";

export const loginTrafficControll = async () => {
  try {
    const data = await correctLoginFormData();
    const URL: string = "/login";
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
