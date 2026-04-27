import { loginSchema, meSchema, logoutSchema } from '../schemas/auth.js';
import * as controller from '../controllers/auth.controller.js';

const loginOpts = {
  schema: loginSchema,
  handler: controller.loginHandler,
};

const logoutOpts = {
  schema: logoutSchema,
  handler: controller.logoutHandler,
};

const meOpts = {
  schema: meSchema,
  handler: controller.meHandler,
};

export function authRoutes(fastify, options, done) {
  fastify.post('/login', loginOpts);
  fastify.get('/logout', logoutOpts);
  fastify.get('/me', meOpts);

  done();
}
