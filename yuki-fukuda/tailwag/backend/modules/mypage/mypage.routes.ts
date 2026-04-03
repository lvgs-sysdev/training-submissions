import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/authenticate.js";
import { getMyPageHandler } from "./mypage.controller.js";

export default async function mypageRoutes(fastify: FastifyInstance) {
  fastify.get("/", { preHandler: [authenticate] }, getMyPageHandler);
}
