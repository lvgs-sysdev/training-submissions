import { userInfo } from "../../../library/users/typeDefinition.ts";
import * as argon2 from "argon2";

export const modifyUserInfo = async (data: userInfo) => {
  //新規登録用データ修正処理
  const hashedPassword = await argon2.hash(data.password);
  const modifiedData = {
    ...data,
    password: hashedPassword,
  };
  return modifiedData;
};
