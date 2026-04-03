import type { FastifyRequest, FastifyReply } from "fastify";
import * as likesService from "./likes.service.js";

export const handleLike = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { postId } = request.params as { postId: string };
  const userId = (request.user as any).id;

  try {
    const result = await likesService.toggleLike(Number(postId), userId);

    const count = await likesService.getLikeCount(Number(postId));

    return reply.send({
      message: result.liked ? "いいねしました!" : "いいねを取り消しました",
      liked: result.liked,
      count: count,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: "いいね処理に失敗しました" });
  }
};
