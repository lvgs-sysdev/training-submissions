const fastify = require('fastify')({ logger: true });
const formbody = require('@fastify/formbody');
const jwt = require('@fastify/jwt');
const staticPlugin = require('@fastify/static');
const path = require('path');

fastify.register(require('./src/plugins/db.js'));

fastify.register(jwt, {
  secret: '95140f97181a5ded65ce26ddd682af21bce8bdb725d56e7f39094d730f5699c7',
});

fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ error: 'Authentication failed' });
  }
});

fastify.register(formbody);

fastify.register(require('./src/routes/user.js'));

fastify.register(require('./src/routes/articles.js'));

fastify.register(staticPlugin, {
  root: path.join(__dirname, 'public'),
});

module.exports = fastify;