import type { FastifyInstance } from "fastify";
import { createPost } from "./posts.controller.js";
import { getTimeline } from "../timeline/timeline.controller.js";
// 1. authenticate をインポート
import { authenticate } from "../../../plugins/authenticate.js";
import { handleLike } from "../likes/likes.controller.js";

export default async function postRoutes(fastify: FastifyInstance) {
  fastify.get("/", { preHandler: [authenticate] }, getTimeline);

  // 2. POST /posts (新規投稿)
  fastify.post("/", { preHandler: [authenticate] }, createPost);

  fastify.post("/:postId/like", { preHandler: [authenticate] }, handleLike);
}
