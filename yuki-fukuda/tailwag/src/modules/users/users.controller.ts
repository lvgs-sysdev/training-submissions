import type { FastifyRequest, FastifyReply } from "fastify";

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.code(200).send({
    message: "ユーザー情報を取得しました",
    user: request.user,
  });
};
