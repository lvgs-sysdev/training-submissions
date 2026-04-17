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
import fastifyMultipart from "@fastify/multipart";
import postRoutes from "./modules/feed/posts/posts.routes.js";
import mypageRoutes from "./modules/mypage/mypage.routes.js";
import breedsRoutes from "./modules/breeds/breeds.routes.js";

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
  origin: [
    "http://localhost:5173", // Vite（これが必要！）
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// publicフォルダを静的ファイルとして公開
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../frontend/public"), // server.tsから見たpublicの場所
  prefix: "/", // http://localhost:3000/ でアクセスできるようにする
});

// JWTの設定
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  // 💡 設定がない場合はエラーを出してサーバーを起動させない（安全策）
  console.error("❌ ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

// JWTの設定
fastify.register(fastifyJwt, {
  secret: jwtSecret,
});

fastify.register(import("@fastify/multipart"), {
  attachFieldsToBody: true,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

// 新規登録・ログイン・ログアウトのルート登録
fastify.register(authRoutes, { prefix: "/auth" });

// ログイン中か確認するルート
fastify.register(userRoutes, { prefix: "/users" });

//一覧表示・投稿用ルート
fastify.register(postRoutes, { prefix: "/api/posts" });

//マイページ取得用のルート
fastify.register(mypageRoutes, { prefix: "/api/mypage" });

//犬種取得のルート
fastify.register(breedsRoutes, { prefix: "/api/breeds" });

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
