'use strict';

const fastify = require('fastify')({logger: true});
const path = require('path');
const fastifyStatic = require('@fastify/static');
const db = require('./db/db');

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public')
})

// articles全件を返すAPIエンドポイント（更新日時が新しい順）
fastify.get('/articles', async () => {
  const data = await db.query('SELECT * FROM articles ORDER BY updated_at DESC');
  const allArticles = data[0];
  return allArticles;
})

// URLから受け取ったidのarticleのデータを返すAPIエンドポイント
fastify.get('/article/:id', async  (request, reply) => {
  const id = request.params.id;
  const [rows] = await db.query('SELECT * FROM articles WHERE id = :id', { id: id });
  return rows[0];
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