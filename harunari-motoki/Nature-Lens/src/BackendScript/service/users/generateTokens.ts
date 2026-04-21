import { FastifyInstance } from "fastify";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    jwt: import("@fastify/jwt").JWT;
  }
}

export const generateTokens = (
  fastify: FastifyInstance,
  user_id: string,
  user_name: string,
) => {
  const accessToken = fastify.jwt.sign(
    { sub: user_id, name: user_name },
    { expiresIn: "10m" },
  );

  const refreshToken = fastify.jwt.sign({ sub: user_id }, { expiresIn: "1d" });
  console.log("generatedTokens.tsでのリフレッシュトークンの中身", refreshToken);
  console.log("generatedTokens.tsでのアクセストークンの中身", accessToken);
  return { accessToken, refreshToken };
};
