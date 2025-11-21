"use strict";

const fastify = require("fastify")({ logger: true });
const path = require("path");
const fastifyStatic = require("@fastify/static");
const db = require("./db/db");

const updateArticleSchema = {
  body: {
    type: 'object',
    required: ['title', 'genre', 'content'],
    properties: {
      title: { type: 'string', maxLength: 255 },
      genre: { type: 'string', maxLength: 20 },
      content: { type: 'string', maxLength: 10000 }
    }
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    }
  }
};

const updateUserSchema = {
  body: {
    type: 'object',
    required: ['user_id', 'user_name'],
    properties: {
      title: { type: 'string', maxLength: 20 },
      user_name: { type: 'string', maxLength: 255 },
    }
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    }
  }
};

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

// articles全件を返すエンドポイント（更新日時が新しい順）
fastify.get("/articles", async () => {
  const [rows] = await db.query(
    "SELECT * FROM articles ORDER BY updated_at DESC"
  );

  return rows;
});

// URLから受け取ったidのarticleのデータと著者のデータを返すエンドポイント
fastify.get("/article/:id", async (request) => {
  const id = request.params.id;
  const [rows] = await db.query(
    `
    SELECT
      articles.id,
      articles.article_title,
      articles.genre,
      articles.content,
      articles.updated_at,
      articles.thumbnail_path,

      users.id AS user_pk_id,
      users.user_id,
      users.user_name,
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

// URLから受け取ったuser_idと一致するarticleのレコードを返すエンドポイント
fastify.get("/articles/:userId", async (request) => {
  const userId = request.params.userId;
  const [rows] = await db.query(
    `
    SELECT
      *
    FROM
      articles
    WHERE
      user_id = :userId
    `,
    { userId: userId }
  );

  return rows;
});

// PUTリクエストで受け取った内容にarticleを更新するエンドポイント
fastify.put("/article/:id", { schema: updateArticleSchema }, async (request, reply) => {
  const id = request.params.id;
  const { title, genre, content } = request.body;

  try {
    const [result] = await db.query(`
      UPDATE
        articles
      SET
        article_title = :title,
        genre = :genre,
        content = :content,
        updated_at = NOW()
      WHERE
        id = :id
      `,
      {
        title: title,
        genre: genre,
        content: content,
        id: id
      }
    );
    if (result.affectedRows === 1) {
      return { success: true, id: id };
    } else {
      // 更新対象が見つからなかった場合
      reply.code(404).send({ success: false, message: '記事が見つかりませんでした。'})
    }
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ success: false, message: '記事の更新に失敗しました。' });
  }
});

// ユーザー全件を返すエンドポイント
fastify.get("/users", async () => {
  const [rows] = await db.query(`
    SELECT
      id,
      user_id,
      user_name,
      icon_path
    FROM
    users
    `);
    
    return rows;
  });
  
// URLから受け取ったidと一致するユーザーを返すエンドポイント
fastify.get("/user/:id", async (request) => {
  const id = request.params.id;
  const [rows] = await db.query(`
    SELECT
      id,
      user_id,
      user_name,
      icon_path
    FROM
      users
    WHERE
      id = :id
    `,
    { id: id }
  );

  return rows[0];
});

// PUTリクエストで受け取った内容にuserを更新するエンドポイント
fastify.put("/user/:id", { schema: updateUserSchema }, async (request, reply) => {
  const id = request.params.id;
  const { userId, userName } = request.body;
  console.log(request.body)

  try {
    const [result] = await db.query(`
      UPDATE
        users
      SET
        user_id = :userId,
        user_name = :userName
      WHERE
        id = :id
      `,
      {
        userId: userId,
        userName: userName,
        id: id
      }
    );
    if (result.affectedRows === 1) {
      return { success: true, id: id };
    } else {
      // 更新対象が見つからなかった場合
      reply.code(404).send({ success: false, message: 'ユーザーが見つかりませんでした。'})
    }
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ success: false, message: 'プロフィールの更新に失敗しました。' });
  }
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
