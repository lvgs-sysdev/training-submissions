import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getIndex } from "../../controllers/getIndex.ts";
import { postRegister } from "../../controllers/users/postRegister.ts";
import { registerSchema, loginSchema } from "../../Interface/schema.ts";
import { postLogin } from "@/BackendScript/controllers/users/postLogin.ts";
import { postRefresh } from "../../controllers/users/postRefresh.ts";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  fastify.get("/", getIndex);
  fastify.post("/register", { schema: registerSchema }, postRegister);
  fastify.post("/login", { schema: loginSchema }, postLogin);
  fastify.post("/refresh", postRefresh);
}
