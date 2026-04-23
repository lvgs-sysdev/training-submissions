import { postUserInfo } from "../../APIservice/users/postUserInfo.js";
import { correctRegisterFormData } from "../../Utils/users/correctRegisterFormData.js";

export const registerTrafficControll = async () => {
  try {
    const data = await correctRegisterFormData();
    const URL: string = "/register";
    console.log("データ送信関数postUserInfo利用前");
    const response = postUserInfo(URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};
