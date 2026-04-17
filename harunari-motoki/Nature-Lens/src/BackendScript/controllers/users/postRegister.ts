import { userInfo } from "../../../library/users/typeDefinition.ts";
import { usersPool } from "../../models/users/DB.ts";
import { registerSQL } from "../../models/users/userSQL.ts";
import { DBAccess } from "../../models/users/DBAccess.ts";
import { modifyUserInfo } from "../../service/users/modifyUseInfo.ts";
import { transformData } from "../../service/users/transformData.ts";

export const postRegister = async function (request, reply) {
  const rawdata = request.body as userInfo;
  console.log("クライアントから受け取ったデータの中身", rawdata);

  try {
    const objectData = await modifyUserInfo(rawdata); //passwordのハッシュ化
    const arrayData = await transformData(objectData); //オブジェクトを配列に変換
    const queryResult = await DBAccess(usersPool, registerSQL, arrayData);
    const message = "success";
    return message;
  } catch (error) {
    throw error;
  }
};
