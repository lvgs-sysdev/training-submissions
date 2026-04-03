import type { FastifyInstance } from "fastify";
import { getMe } from "./users.controller.js";
import { authenticate } from "../../plugins/authenticate.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/me", { preHandler: authenticate }, getMe);
}
