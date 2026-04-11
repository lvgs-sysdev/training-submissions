import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { postScanprocess } from "../controllers/postScanTraffics.ts";
import { coordinateSchema } from "../../sharedObject/typeDeffinition.ts";
import { getIndex } from "../controllers/getIndex.ts";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  fastify.get("/", getIndex);
  fastify.post("/scanResult", { schema: coordinateSchema }, postScanprocess);
}
