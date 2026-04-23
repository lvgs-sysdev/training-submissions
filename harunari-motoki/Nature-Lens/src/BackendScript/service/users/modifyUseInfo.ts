import { userInfo } from "../../../library/users/typeDefinition.js";
import * as argon2 from "argon2";

export const modifyUserInfo = async (data: userInfo) => {
  const hashedPassword = await argon2.hash(data.password);
  const modifiedData = {
    ...data,
    password: hashedPassword,
  };
  return modifiedData;
};
