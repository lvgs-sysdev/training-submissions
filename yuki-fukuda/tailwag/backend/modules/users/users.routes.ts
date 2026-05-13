import type { FastifyInstance } from "fastify";
import { followUserHandler, getMe } from "./users.controller.js";
import { authenticate } from "../../plugins/authenticate.js";
import { getUserHandler } from "./users.controller.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/me", { preHandler: authenticate }, getMe);
  fastify.get("/:id", { preHandler: authenticate }, getUserHandler);
  fastify.post("/:id/follow", { preHandler: authenticate }, followUserHandler);
}
