import type { FastifyRequest, FastifyReply } from "fastify";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // トークンの検証
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
};
