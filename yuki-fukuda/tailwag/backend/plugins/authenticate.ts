import type { FastifyRequest, FastifyReply } from "fastify";
import "@fastify/jwt";

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
