import { FastifyRequest, FastifyReply } from "fastify";
import { PATH } from "../config/pathConfig.ts";
import fs from "node:fs/promises";

export const getIndex = async function (
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const html = await fs.readFile(PATH.INDEX_HTML, "utf-8");
  return reply.type("text/html").send(html);
};
