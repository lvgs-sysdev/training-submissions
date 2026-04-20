import * as dotenv from "dotenv";
dotenv.config();
import { protectedScanRoutes } from "./BackendScript/routes/scan/protectedScanRoutes.ts";
import usersRoutes from "./BackendScript/routes/users/userRoutes.ts";
import { protectedUserRoutes } from "./BackendScript/routes/users/protectedUserRoutes.ts";
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

const app = Fastify({
  logger: true,
});

app.register(protectedUserRoutes);
app.register(protectedScanRoutes);
app.register(usersRoutes);

await app.register(cors, {
  origin: "http://localhost:5173",
});

//Cookieの設定（リフレッシュトークン用）
app.register(fastifyCookie, {
  secret: process.env.JWT_REFRESH_SECRET,
});
//JWTの設定（アクセストークン用）
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
