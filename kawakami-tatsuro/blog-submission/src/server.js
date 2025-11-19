"use strict";

const fastify = require("fastify")({ logger: true });
const path = require("path");
const fastifyStatic = require("@fastify/static");
const db = require("./db/db");

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

// articles全件を返すAPIエンドポイント（更新日時が新しい順）
fastify.get("/articles", async () => {
  const [rows] = await db.query(
    "SELECT * FROM articles ORDER BY updated_at DESC"
  );

  return rows;
});

// URLから受け取ったidのarticleのデータと著者のデータを返すAPIエンドポイント
fastify.get("/article/:id", async (request) => {
  const id = request.params.id;
  const [rows] = await db.query(`
    SELECT
      articles.id,
      articles.article_title,
      articles.genre, articles.content,
      articles.updated_at,
      articles.thumbnail_path,
      users.user_id, users.user_name,
      users.icon_path
    FROM
      articles
    INNER JOIN
      users ON articles.user_id = users.user_id
    WHERE
      articles.id = :id
    `,
    { id: id }
  );

  return rows[0];
});

fastify.get("/users", async () => {
  const [rows] = await db.query(`
    SELECT
      id,
      user_name,
      icon_path
    FROM
      users
    `);

    return rows;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
