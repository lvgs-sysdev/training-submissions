import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getIndex } from "../../controllers/getIndex.ts";
import { postRegister } from "../../controllers/users/postRegister.ts";
import { registerSchema, loginSchema } from "../../Interface/schema.ts";
import { postLogin } from "@/BackendScript/controllers/users/postLogin.ts";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  console.log("userRoute.tsここまでくるの？");
  fastify.get("/", getIndex);
  fastify.post("/register", { schema: registerSchema }, postRegister);
  fastify.post("/login", { schema: loginSchema }, postLogin);
}
