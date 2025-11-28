"use strict";

const db = require("../db/db");
const { getArticleAuthorId, getUserFromSession } = require('../utils/authHelper');
const { updateArticleSchema } = require('../schemas');

async function articlesRoutes (fastify) {

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
  fastify.put(
    "/article/:id",
    { schema: updateArticleSchema },
    async (request, reply) => {
      const id = request.params.id;
      const sessionId = request.cookies.session_id;
      const { title, genre, content } = request.body;

      const targetArticleAuthorId = await getArticleAuthorId(id);
      const currentUser = await getUserFromSession(sessionId);

      if (!currentUser) {
        return reply.code(401).send({ message: "ログインしてください。" });
      }

      const currentUserId = currentUser.user_id;

      if (String(targetArticleAuthorId) !== String(currentUserId)) {
        return reply.code(403).send({ message: "権限がありません。" });
      }

      try {
        const [result] = await db.query(
          `
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
            id: id,
          }
        );
        if (result.affectedRows === 1) {
          return { success: true, id: id };
        } else {
          // 更新対象が見つからなかった場合
          reply
            .code(404)
            .send({ success: false, message: "記事が見つかりませんでした。" });
        }
      } catch (error) {
        request.log.error(error);
        reply
          .code(500)
          .send({ success: false, message: "記事の更新に失敗しました。" });
      }
    }
  );
}

module.exports = articlesRoutes;
