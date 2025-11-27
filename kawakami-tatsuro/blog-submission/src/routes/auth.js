"use strict";

const db = require("../db/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function authRoutes(fastify) {
  fastify.post("/register", async (request, reply) => {
    const { userId, password, userName } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const [result] = await db.query(
        `
      INSERT INTO
        users
        (user_id, password, user_name)
      VALUES
        (:userId, :hashedPassword, :userName)
      `,
        {
          userId: userId,
          hashedPassword: hashedPassword,
          userName: userName,
        }
      );
      if (result.affectedRows === 1) {
        reply.code(201).send({ success: true, id: result.insertId });
      }
    } catch (error) {
      request.log.error(error);

      if (error.code === "ER_DUP_ENTRY") {
        reply.code(409).send({
          success: false,
          message: "そのユーザーIDはすでに使用されています。",
        });
      } else {
        reply
          .code(500)
          .send({ success: false, message: "ユーザーの登録に失敗しました。" });
      }
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { userId, password } = request.body;

    try {
      const [rows] = await db.query(
        `
      SELECT
        *
      FROM
        users
      WHERE
        user_id = :userId
      `,
        { userId: userId }
      );

      const user = rows[0];

      if (!user) {
        return reply
          .code(401)
          .send({
            success: false,
            message: "ユーザーIDまたはパスワードが間違っています。",
          });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return reply
          .code(401)
          .send({
            success: false,
            message: "ユーザーIDまたはパスワードが間違っています。",
          });
      } else {
        const sessionId = crypto.randomUUID();

        await db.query(
          `
        INSERT INTO
          sessions
          (session_id, user_id)
        VALUES
          (:sessionId, :userId)
          `,
          { sessionId: sessionId, userId: userId }
        );

        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          secure: false,
          sameSite: "lax",
        });

        return reply
          .code(200)
          .send({ success: true, message: "ログインに成功しました。" });
      }
    } catch (error) {
      request.log.error(error);
      reply
        .code(500)
        .send({ success: false, message: "ログインに失敗しました。" });
    }
  });

  // 現在ログインしているユーザーの情報を返却する
  fastify.get("/auth/me", async (request, reply) => {
    const sessionId = request.cookies.session_id;

    if (!sessionId) {
      return reply
        .code(401)
        .send({ success: false, message: "ログインを行ってください。" });
    }

    try {
      const [rows] = await db.query(
        `
      SELECT
        users.id,
        users.user_id,
        users.user_name
      FROM
        sessions
      JOIN
        users
      ON
        sessions.user_id = users.user_id
      WHERE
        sessions.session_id = :sessionId
      `,
        { sessionId: sessionId }
      );
      const user = rows[0];

      if (!user) {
        reply.clearCookie("session_id", { path: "/" });
        return reply
          .code(401)
          .send({
            success: false,
            message:
              "セッションが切れています。恐れ入りますが、再度ログインを行ってください。",
          });
      }

      reply
        .code(200)
        .send({
          success: true,
          message: "ログイン済み。",
          id: user.id,
          userId: user.user_id,
          userName: user.user_name,
        });
    } catch (error) {
      request.log.error(error);
      reply
        .code(500)
        .send({
          success: false,
          message:
            "エラーが発生しました。恐れ入りますが、しばらく時間をおいてアクセスしてください。",
        });
    }
  });

  fastify.post("/logout", async (request, reply) => {
    const sessionId = request.cookies.session_id;

    try {
      if (sessionId) {
        await db.query(
          `
        DELETE FROM
          sessions
        WHERE
          session_id = :sessionId
        `,
          { sessionId: sessionId }
        );
      }
    } catch (error) {
      request.log.error(error);
    }

    reply.clearCookie("session_id", { path: "/" });

    return { success: true };
  });
}

module.exports = authRoutes;