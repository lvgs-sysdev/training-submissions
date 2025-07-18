const db = require("../db/db.js");
const bcrypt = require("bcrypt");

module.exports = async function (fastify) {
  fastify.get("/login", (request, reply) => {
    if (request.session.user) {
      reply.redirect("/");
    } else {
      reply.sendFile("login.html");
    }
  });

  //ユーザーのログイン処理
  fastify.post("/loginUser", async (request, reply) => {
    const userId = request.body.userId;
    const password = request.body.password;
    let encodedMsg = "";
    try {
      const [rows] = await db.query(`SELECT user_id, user_name, password FROM users where user_id = ?`, [userId]);
      if (rows.length > 0) {
        const isMatch = await bcrypt.compare(password, rows[0].password)
        if (isMatch) {
          request.session.user = { userId: rows[0].user_id, user_name: rows[0].user_name };
          reply.redirect("/");
        }
      }
      encodedMsg = encodeURIComponent("ログインに失敗しました。ユーザーIDかパスワードが違います。");
      reply.redirect(`/login?msg=${encodedMsg}`);
    } catch (error) {
      request.log.error("ログインに失敗しました:", error);
      reply.status(500).send('Internal Server Error');
    }
  });

  //ユーザーのログイン状態の確認
  fastify.get("/loginStatus", (request, reply) => {
    let loginStatus = false;
    if (request.session.user) {
      loginStatus = true;
    }
    reply.send(loginStatus);
  });

  //ユーザーのログアウト処理
  fastify.get("/logout", async (request, reply) => {
    if (request.session.user) {
      request.session.destroy(error => {
        if (error) {
          request.log.error('セッションの破棄に失敗しました:', error);
          reply.sendFile("error.html");
        }
      });
      const encodedMsg = encodeURIComponent("ログアウトしました");
      reply.redirect(`/login?msg=${encodedMsg}`);
    }
    reply.redirect("/login");
  });
}