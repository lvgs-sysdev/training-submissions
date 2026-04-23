// Import the framework and instantiate it
import Fastify from 'fastify';
import { createConnection } from './src/database.js';
import fastifyStatic from '@fastify/static';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import path from 'node:path';
const fastify = Fastify({
  logger: true,
});

import { userRoutes } from './src/routes/user.route.js';
import { articleRoutes } from './src/routes/article.route.js';
import { authRoutes } from './src/routes/auth.route.js';
import { tagRoutes } from './src/routes/tag.route.js';
import 'dotenv/config';

fastify.register(userRoutes);
fastify.register(articleRoutes);
fastify.register(authRoutes);
fastify.register(tagRoutes);

fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, 'public'),
  extensions: ['html'], // .html を補完して探す。ex.GET:/login→レスポンス:/login/index.html
});

fastify.get('/detail/:id(^\\d+)', async function handler(request, reply) {
  await reply.sendFile('/detail/index.html');
});

fastify.get('/editBlog/:id(^\\d+)', async function handler(request, reply) {
  await reply.sendFile('/editBlog/index.html');
});

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  cookieName: 'sessionId_test',
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1800000, secure: false },
});

// Run the server!
try {
  await fastify.listen({ port: 3000 }, () => {
    createConnection();
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
