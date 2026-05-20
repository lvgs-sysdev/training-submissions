import type { FastifyRequest, FastifyReply } from "fastify";
import { getAllBreeds } from "./breeds.service.js";

export const getBreedsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const breeds = await getAllBreeds();
    return reply.send(breeds);
  } catch (error) {
    console.error(error);
    return reply
      .status(500)
      .send({ message: "犬種リストの取得に失敗しました" });
  }
};
