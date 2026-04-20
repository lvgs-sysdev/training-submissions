import { FastifyInstance } from "fastify";
import { generateTokens } from "./generateTokens";

export const refreshAccessToken = async (
  app: FastifyInstance,
  refreshToken: string,
) => {
  const decoded = (await app.jwt.verify(refreshToken)) as any;

  const { accessToken } = generateTokens(app, decoded.sub, decoded.name);
  console.log("refreshAccessTokenの処理後のaccessToken", accessToken);
  return accessToken;
};
