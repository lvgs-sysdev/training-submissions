const db = require("../db/db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async function (fastify) {
  fastify.get("/user", (request, reply) => {
    reply.sendFile("user.html");
  });

  //ユーザーがクリックしたユーザーの情報を取得する処理
  fastify.get("/userDetail", async (request, reply) => {
    const userId = request.query.id;
    try {
      const [rows] = await db.query(`SELECT user_id, user_name FROM users WHERE user_id = ?`, [userId]);
      reply.send(rows[0]);
    } catch (error) {
      request.log.error("DBからのデータ取得に失敗しました:", error);
      reply.sendFile("error.html");
    }
  });

  //ユーザー情報編集ボタンを押した時にユーザー情報編集ページを表示する処理
  fastify.get("/editUser", (request, reply) => {
    const userId = request.query.id;
    if (request.session.user) {
      if (request.session.user.userId === userId) {
        reply.sendFile("editUser.html");
      } else {
        const encodedMsg = encodeURIComponent("該当ユーザーでログインしてください");
        reply.redirect(`/user?id=${userId}&msg=${encodedMsg}`);
      }
    } else {
      const encodedMsg = encodeURIComponent("ログインしてください");
      reply.redirect(`/login?msg=${encodedMsg}`);
    }
  });

  //ユーザー情報の編集のためにユーザーの情報を取得する処理
  fastify.get("/editUserPage", async (request, reply) => {
    const userId = request.query.id;
    let encodedMsg = "";
    if (request.session.user) {
      if (request.session.user.userId === userId) {
        try {
          const [rows] = await db.query(`SELECT user_id, user_name FROM users WHERE user_id = ?`, [userId]);
          reply.send(rows[0]);
        } catch (error) {
          request.log.error("DBからのユーザー情報取得に失敗しました:", error);
          reply.sendFile("error.html");
        }
      } else {
        encodedMsg = encodeURIComponent("該当ユーザーでログインしてください");
        reply.redirect(`/login?msg=${encodedMsg}`);
      }
    } else {
      encodedMsg = encodeURIComponent("ログインしてください");
      reply.redirect(`/login?msg=${encodedMsg}`);
    }
  });

  //ユーザー情報の編集処理
  fastify.post("/editUser", async (request, reply) => {
    const userId = request.body.userId;
    const userName = request.body.userName;
    let encodedMsg = "";
    if (request.session.user) {
      if (request.session.user.userId === userId) {
        if (userName.length > 255) {
          encodedMsg = encodeURIComponent("ユーザー名が255文字を超えています");
        } else {
          try {
            const [result] = await db.query(`UPDATE users set user_name = ? WHERE user_id = ?`, [userName, userId]);
            encodedMsg = encodeURIComponent("ユーザー情報を変更しました");
          } catch (error) {
            request.log.error("ユーザー情報の編集に失敗しました:", error);
            encodedMsg = encodeURIComponent("ユーザー情報の変更に失敗しました");
            reply.redirect(`/user?id=${userId}&msg=${encodedMsg}`);
          }
        }
        reply.redirect(`/user?id=${userId}&msg=${encodedMsg}`);
      } else {
        encodedMsg = encodeURIComponent("該当ユーザーでログインしてください");
      }
    } else {
      encodedMsg = encodeURIComponent("ログインしてください");
    }
    reply.redirect(`/login?msg=${encodedMsg}`);
  });

  fastify.get("/register", (request, reply) => {
    reply.sendFile("register.html");
  });

  //ユーザーの新規登録処理
  fastify.post("/registerUser", async (request, reply) => {
    const userId = request.body.userId;
    const userName = request.body.userName;
    const password = request.body.password;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const validCharsRegex = /^[a-zA-Z0-9!@#$%^&*()_+-=\[\]{};:'"\\|,<.>\/?`~]+$/;
    let encodedMsg = "";
    if (userId.length > 20) {
      encodedMsg = encodeURIComponent("ユーザーIDが20文字を超えています");
    } else if (!validCharsRegex.test(userId)) {
      encodedMsg = encodeURIComponent("ユーザーIDは英数字記号のみ使用することができます");
    } else if (userName.length > 255) {
      encodedMsg = encodeURIComponent("ユーザー名が255文字を超えています");
    } else if (password.length > 255) {
      encodedMsg = encodeURIComponent("パスワードが255文字を超えています");
    } else if (!validCharsRegex.test(password)) {
      encodedMsg = encodeURIComponent("パスワードは英数字記号のみ使用することができます");
    } else {
      try {
        const [rows] = await db.query(`SELECT user_id FROM users where user_id = ?`, [userId]);
        if (rows.length === 0) {
          const [result] = await db.query(`INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)`, [userId, hashedPassword, userName]);
          encodedMsg = encodeURIComponent("ユーザーの新規登録に成功しました");
          reply.redirect(`/login?msg=${encodedMsg}`);
        } else {
          encodedMsg = encodeURIComponent("登録済みのユーザーIDです。ユーザーIDを変えて再度登録をお願いします。");
        }
      } catch (error) {
        request.log.error("ユーザーの新規登録中にエラーが発生しました:", error);
        encodedMsg = encodeURIComponent("ユーザーの新規登録中にエラーが発生しました");
        reply.redirect(`/register?msg=${encodedMsg}`);
      }
    }
    reply.redirect(`/register?msg=${encodedMsg}`);
  });
}