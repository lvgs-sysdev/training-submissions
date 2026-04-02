import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import formbody from "@fastify/formbody";
import fastifycookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import view from "@fastify/view";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import dbPlugin from "./js/DB.js";
import { loginPool } from "./js/DB.js";
import publicRoute from "./route/public/publicRoute.js";
import privateRoute from "./route/private/privateRoute.js";

/**Fastify関数の登録
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */

const fastify = Fastify({
  logger: true,
});

fastify.decorateRequest("getUserName", function () {
  if (this.session && this.session.user) {
    return this.session.user.name;
  } else {
    return null;
  }
});

fastify.decorate("authenticate", async (request, reply) => {
  const session = request.session.user;
  if (!session) {
    return reply.redirect("/login");
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

fastify.register(publicRoute);
fastify.register(async (loginUserArea) => {
  loginUserArea.addHook("preHandler", fastify.authenticate);
  loginUserArea.register(privateRoute);
});
fastify.register(dbPlugin);
fastify.register(formbody);
fastify.register(fastifycookie);
fastify.register(fastifySession, {
  secret: "a-very-secret-key-at-least-32-chars-long!!",
  cookie: {
    secure: false, //本番環境ではtrueにする
    httpOnly: true,
    sameSite: "lax",
  },
});

fastify.register(view, {
  engine: {
    ejs: ejs,
  },
  root: "./temprates",
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "browser"),
  prefix: "/browser/",
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "js"),
  prefix: "/js/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "assets"),
  prefix: "/assets/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "css"),
  prefix: "/css/",
  decorateReply: false,
});

async function startServer() {
  try {
    await loginPool.getConnection();
    console.log("データベース接続成功");
  } catch (err) {
    console.err("データベースの接続に失敗しました。", err);
    process.exit(1);
  }
}

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
