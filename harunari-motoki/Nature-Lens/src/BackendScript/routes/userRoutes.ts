import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getIndex } from "../controllers/getIndex.ts";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  fastify.get("/", getIndex);
}
