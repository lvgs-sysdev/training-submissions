import {
  accessStatus,
  userInfo,
} from "../../../library/users/typeDefinition.js";
import { verifyPassword } from "../..//service/users/verifyPassword.js";
import { generateTokens } from "../../service/users/generateTokens.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { loginDBAccess } from "../../service/users/loginDBAccess.js"

export const postLogin = async function (
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const rawdata = request.body as userInfo;

  try {
    const {user_id, user_name, password, password_hash} = await loginDBAccess(rawdata);

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
      return result;
    } else {
      const result: accessStatus = {
        status: "failure",
      };
      return result;
    }
  } catch (error: any) {
    console.error("エラー発生", error);
    throw error;
  }
};
