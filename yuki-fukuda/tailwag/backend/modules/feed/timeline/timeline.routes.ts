import type { FastifyInstance } from "fastify";
import { getTimeline } from "./timeline.controller.js";

export default async function timelineRoutes(fastify: FastifyInstance) {
  fastify.get("/", getTimeline);
}
