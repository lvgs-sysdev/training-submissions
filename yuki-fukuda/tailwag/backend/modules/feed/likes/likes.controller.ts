import type { FastifyRequest, FastifyReply } from "fastify";
import * as likesService from "./likes.service.js";

export const handleLike = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params as { id: string }; // 投稿ID
    const userId = (request.user as any).id; // 実行したユーザーID

    // 💡 サービスを呼び出す際、引数の数や型が合っているか確認！
    const result = await likesService.toggleLike(Number(id), userId);

    return reply.send(result);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: "いいね処理に失敗しました🐾" });
  }
};
