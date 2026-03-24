// auth/auth.routes.ts
import type { FastifyInstance } from "fastify";
import { login } from "./login/login.controller.js";
import { register } from "./register/register.controller.js";
import { logout } from "./logout/logout.controller.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", login);
  fastify.post("/register", register);
  fastify.post("/logout", logout);
}
