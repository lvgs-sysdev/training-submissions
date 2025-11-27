"use strict";

const db = require("../db/db");
const { getUserFromSession } = require('../utils/authHelper');
const { updateUserSchema } = require('../schemas');

async function usersRoutes(fastify) {
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
  fastify.put(
    "/user/:id",
    { schema: updateUserSchema },
    async (request, reply) => {
      const sessionId = request.cookies.session_id;
      const id = request.params.id;
      const { user_id: userId, user_name: userName } = request.body;

      const currentUser = await getUserFromSession(sessionId);

      if (!currentUser) {
        return reply.code(401).send({ message: "ログインしてください。" });
      }

      const currentUserId = currentUser.id;

      if (String(id) !== String(currentUserId)) {
        return reply.code(403).send({ message: "権限がありません。" });
      }

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
            id: id,
          }
        );
        if (result.affectedRows === 1) {
          return { success: true, id: id };
        } else {
          // 更新対象が見つからなかった場合
          reply
            .code(404)
            .send({
              success: false,
              message: "ユーザーが見つかりませんでした。",
            });
        }
      } catch (error) {
        request.log.error(error);
        reply
          .code(500)
          .send({
            success: false,
            message: "プロフィールの更新に失敗しました。",
          });
      }
    }
  );
}

module.exports = usersRoutes;
