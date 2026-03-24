import Fastify from "fastify";
import "dotenv/config";
import ajvFormats from "ajv-formats";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./modules/users/users.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import cors from "@fastify/cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      strict: false,
    },
    plugins: [ajvFormats as any],
  },
});

await fastify.register(cors, {
  origin: true, //開発中の設定
  methods: ["GET", "POST", "PUT", "DELETE"],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// publicフォルダを静的ファイルとして公開
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public"), // server.tsから見たpublicの場所
  prefix: "/", // http://localhost:3000/ でアクセスできるようにする
});

// JWTの設定
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "supersecretkey-yuki-2026", // 署名用の秘密鍵
});

// 新規登録・ログイン・ログアウトのルート登録
fastify.register(authRoutes, { prefix: "/auth" });

// ログイン中か確認するルート
fastify.register(userRoutes, { prefix: "/user" });

fastify.get("/", async () => {
  return { hello: "TailWag Server (Fastify)" };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port: port, host: "0.0.0.0" });
    console.log(`Server is running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
