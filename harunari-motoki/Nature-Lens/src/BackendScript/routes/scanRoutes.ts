import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { postScanpTraffics } from "../controllers/postScanTraffics.ts";
import { coordinateSchema } from "../Interface/schema.ts";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  fastify.post("/scanResult", { schema: coordinateSchema }, postScanpTraffics);
}
