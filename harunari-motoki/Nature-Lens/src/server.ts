import * as dotenv from "dotenv";
dotenv.config();
import { protectedScanRoutes } from "./BackendScript/routes/scan/protectedScanRoutes.js";
import usersRoutes from "./BackendScript/routes/users/userRoutes.js";
import { protectedUserRoutes } from "./BackendScript/routes/users/protectedUserRoutes.js";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import path from "path";
import Fastify from "fastify";
import { PATH } from "./BackendScript/config/pathConfig.js";

import fastifyStatic from "@fastify/static";

const app = Fastify({
  logger: true,
});
// フロントエンド用のファイルを配信許可設定
app.register(fastifyStatic, {
  root: PATH.VITE_FRONTEND,
  prefix: "/",
  wildcard: false,
});

app.register(protectedUserRoutes);
app.register(protectedScanRoutes);
app.register(usersRoutes);

await app.register(cors, {
  origin: "http://localhost:5173",
});

app.register(fastifyCookie, {
  secret: process.env.JWT_REFRESH_SECRET,
});
const jwtsecret = process.env.JWT_ACCESS_SECRET;
if (!jwtsecret) {
  throw new Error("環境変数JWT_SECRETが設定されていません");
}
app.register(fastifyJwt, {
  secret: jwtsecret,
});

app.listen({ port: 3000 }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
