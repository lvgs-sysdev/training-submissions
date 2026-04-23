import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { postRegister } from "../../controllers/users/postRegister.js";
import { registerSchema, loginSchema } from "../../Interface/schema.js";
import { postLogin } from "../../../BackendScript/controllers/users/postLogin.js";
import { postRefresh } from "../../controllers/users/postRefresh.js";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  fastify.post("/register", { schema: registerSchema }, postRegister);
  fastify.post("/login", { schema: loginSchema }, postLogin);
  fastify.post("/refresh", postRefresh);
}
