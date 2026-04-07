import type { FastifyRequest, FastifyReply } from "fastify";
import * as postService from "./timeline.service.js";

export const getTimeline = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    if (!request.user) {
      return reply.code(401).send({ message: "認証が必要です" });
    }

    const currentUserId = (request.user as any).id;

    // 💡 1. クエリから search を取り出す（これが必要だった！）
    const { search } = request.query as { search?: string };

    // 💡 2. 第3引数に search を渡す！！
    const posts = await postService.getAllPosts(
      currentUserId,
      undefined,
      search,
    );

    return reply.code(200).send(posts);
  } catch (error) {
    console.error("Controller Error:", error);
    return reply.code(500).send({ message: "取得失敗" });
  }
};
