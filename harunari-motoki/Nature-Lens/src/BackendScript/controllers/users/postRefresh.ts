import { refreshAccessToken } from "../../service//users/refreshAccessToken.ts";
import { accessStatus } from "../../../library/users/typeDefinition.ts";
import { FastifyReply, FastifyRequest } from "fastify";

export const postRefresh = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const refreshToken = request.cookies.refreshToken;
  console.log("postRefresh.ts内でのリフレッシュトークンを確認", refreshToken);
  if (!refreshToken) {
    return reply.status(401).send({ message: "No Refresh Token" });
  }
  try {
    console.log("postRefresh.ts でrefreshAccessToken呼び出し前");
    const accessToken = await refreshAccessToken(request.server, refreshToken);
    const result: accessStatus = {
      status: "success",
      token: accessToken,
    };
    console.log("getRefresh.ts accessToken送信前", result);
    return result;
  } catch (error) {
    return reply.status(401).send({ message: "Invalid Token" });
  }
};
