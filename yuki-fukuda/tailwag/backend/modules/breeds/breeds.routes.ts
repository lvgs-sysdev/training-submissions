import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/authenticate.js";
import { getBreedsHandler } from "./breeds.controller.js";

export default async function breedsRoutes(fastify: FastifyInstance) {
  fastify.get("/", { preHandler: [authenticate] }, getBreedsHandler);
}
