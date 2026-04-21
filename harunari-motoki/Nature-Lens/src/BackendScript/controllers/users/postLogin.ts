import {
  accessStatus,
  userInfo,
} from "../../../library/users/typeDefinition.ts";
import { usersPool } from "../../models/users/DB.ts";
import { loginSQL } from "../../models/users/userSQL.ts";
import { DBAccess } from "../../models/users/DBAccess.ts";
import { transformData } from "../../service/users/transformData.ts";
import { verifyPassword } from "../..//service/users/verifyPassword.ts";
import { generateTokens } from "../../service/users/generateTokens.ts";
import { FastifyReply, FastifyRequest } from "fastify";

export const postLogin = async function (
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const rawdata = request.body as userInfo;
  console.log("クライアントから受け取ったデータの中身", rawdata);

  try {
    const arrayData = await transformData(rawdata);
    console.log("postLogin arrayData", arrayData);
    const user_ID = [arrayData[0]];
    console.log("postLogin user_IDは", user_ID);
    const password = arrayData[1];
    console.log("postLogin passwordは", password);
    const { user_id, user_name, password_hash } = await DBAccess(
      usersPool,
      loginSQL,
      user_ID,
    );
    console.log("postLogin password_hashは", password_hash);
    const isMatch = await verifyPassword(password_hash, password);

    if (isMatch) {
      const { accessToken, refreshToken } = await generateTokens(
        request.server,
        user_id,
        user_name,
      );
      reply.setCookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: false, //本番環境ではtrue
        sameSite: "lax",
        maxAge: 1 * 24 * 60 * 60,
      });
      const result: accessStatus = {
        status: "success",
        token: { accessToken },
      };
      console.log("クライアントに送信する");
      return result;
    } else {
      const result: accessStatus = {
        status: "failure",
      };
      console.log("postLogin.ts 認証結果", isMatch, "と", result);
      return result;
    }
  } catch (error: any) {
    console.error("エラー発生", error);
    throw error;
  }
};
