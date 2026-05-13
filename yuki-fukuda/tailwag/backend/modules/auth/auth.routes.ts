// auth/auth.routes.ts
import type { FastifyInstance } from "fastify";
import { login } from "./login/login.controller.js";
import { register } from "./register/register.controller.js";
import { logout } from "./logout/logout.controller.js";
import { registerSchema } from "./register/register.schema.js";
import { loginSchema } from "./login/login.schema.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", { schema: { body: loginSchema } }, login);
  fastify.post("/register", { schema: { body: registerSchema } }, register);
  fastify.post("/logout", logout);
}
