'use strict';

const fastify = require('fastify')({logger: true});
const path = require('path');
const fastifyStatic = require('@fastify/static');
const db = require('./db/db');

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public')
})

fastify.get('/articles', async (request, reply) => {
  const data = await db.query('SELECT * FROM articles');
  const allArticles = data[0];
  return allArticles;
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  }
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();