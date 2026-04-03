import type { FastifyRequest, FastifyReply } from "fastify";
import * as postService from "./timeline.service.js";

export const getTimeline = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // 💡 request.user が存在するかチェックする
    if (!request.user) {
      return reply.code(401).send({ message: "認証が必要です" });
    }

    const currentUserId = (request.user as any).id;
    const posts = await postService.getAllPosts(currentUserId);

    return reply.code(200).send(posts);
  } catch (error) {
    console.error("Controller Error:", error);
    return reply.code(500).send({ message: "取得失敗" });
  }
};
