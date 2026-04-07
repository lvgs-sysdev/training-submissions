import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/authenticate.js";
import { getMyPageHandler, updateProfileHandler } from "./mypage.controller.js";

export default async function mypageRoutes(fastify: FastifyInstance) {
  // 自分のマイページ用
  fastify.get("/", { preHandler: [authenticate] }, getMyPageHandler);
  // 相手のマイページ用（IDをパラメータとして受け取る）
  fastify.get("/:id", getMyPageHandler);
  fastify.patch("/edit", { preHandler: [authenticate] }, updateProfileHandler);
}
