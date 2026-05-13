import { FastifyInstance } from "fastify";
import { generateTokens } from "./generateTokens.js";
import { DBAccess } from "../../models/users/DBAccess.js";
import {usersPool} from "../../models/users/DB.js"
import { refreshSQL } from "../../models/users/userSQL.js";

export const refreshAccessToken = async (
  app: FastifyInstance,
  refreshToken: string,
) => {
  const decoded = (await app.jwt.verify(refreshToken)) as any;
  const user_id = decoded.sub
  const { user_name } = await DBAccess(usersPool,refreshSQL,[user_id])

  const { accessToken } = generateTokens(app, user_id, user_name);
  console.log("refreshAccessTokenの処理後のaccessToken", accessToken);
  return accessToken;
};
