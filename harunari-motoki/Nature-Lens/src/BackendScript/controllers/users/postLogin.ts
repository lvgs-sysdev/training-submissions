import {
  accessStatus,
  userInfo,
} from "../../../library/users/typeDefinition.ts";
import { usersPool } from "../../models/users/DB.ts";
import { loginSQL } from "../../models/users/userSQL.ts";
import { DBAccess } from "../../models/users/DBAccess.ts";
import { transformData } from "../../service/users/transformData.ts";
import { verifyPassword } from "../..//service/users/verifyPassword.ts";

export const postLogin = async function (request, reply) {
  const rawdata = request.body as userInfo;
  console.log("クライアントから受け取ったデータの中身", rawdata);

  try {
    //DBからhash_passwordのみを取得　user_idを使う
    const arrayData = await transformData(rawdata); //オブジェクトを配列に変換
    console.log("postLogin arrayData", arrayData);
    const user_ID = [arrayData[0]];
    console.log("postLogin user_IDは", user_ID);
    const password = arrayData[1];
    console.log("postLogin passwordは", password);
    const db_hash = await DBAccess(usersPool, loginSQL, user_ID); //user_idのみをつかいたい
    console.log("postLogin password_hashは", db_hash);
    const isMatch = await verifyPassword(db_hash, password);

    if (isMatch) {
      //JWTトークンの発行 処理----------

      //-----------------------------
      const result: accessStatus = {
        status: "success",
      };
      return result;
    } else {
      const result: accessStatus = {
        status: "failure",
      };
      console.log("postLogin.ts 認証結果", isMatch, "と", result);
      return result;
    }
  } catch (error: any) {
    console.error("ログイン処理内でエラー発生", error);
    throw error;
  }
};
