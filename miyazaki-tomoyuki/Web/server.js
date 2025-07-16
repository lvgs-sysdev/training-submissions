const fastify = require("fastify")({ logger: true });
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const saltRounds = 10;
fastify.register(require('@fastify/formbody'));
fastify.register(require('@fastify/cookie'));
fastify.register(require('@fastify/session'), {
  secret: 'a_very_secret_string_that_is_at_least_32_chars_long', // ★ここを追加！★
  cookie: {
    secure: false
    , maxAge: 86400000 // クッキーの有効期限 (ミリ秒) - 例: 1日
  }
});


fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, ""),
});

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1924zaki725@",
  database: "web_app",
  waitForConnections: true,
  connectionLimit: 3,
  namedPlaceholders: true,
});

fastify.get("/", (request, reply) => {
  reply.sendFile("toppage.html");
});

//最新の記事情報を6つ取得する処理
fastify.get("/articles", async (request, reply) => {
  try {
    const [rows] = await db.query("SELECT id, article_title, SUBSTRING(content, 1, 20) AS content, updated_at FROM articles ORDER BY updated_at DESC LIMIT 6");
    reply.send(rows);
  } catch (error) {
    request.log.error("DBからの最新記事のデータ取得に失敗しました:", error);
    reply.sendFile("error.html");
  }
});

fastify.get("/detail", (request, reply) => {
  reply.sendFile("detail.html");
});

//ユーザーがクリックした記事の情報を取得する処理
fastify.get("/articleDetail", async (request, reply) => {
  const articleId = request.query.id;
  try {
    const [rows] = await db.query(`SELECT art.id, art.article_title, art.content, user.user_name, user.user_id FROM articles art INNER JOIN users user ON art.user_id = user.user_id where art.id = ?`, [articleId]);
    reply.send(rows[0]);
  } catch (error) {
    request.log.error("DBからのユーザーがクリックした記事データ取得に失敗しました:", error);
    reply.sendFile("error.html");
  }
});

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

fastify.get("/editUser", (request, reply) => {
  const userId = request.query.id;
  if (request.session.user) {
    if (request.session.user.userId === userId) {
      reply.sendFile("editUser.html");
    } else {
      const encodedMsg = encodeURIComponent("該当ユーザーでログインしてください");
      reply.redirect(`/login?msg=${encodedMsg}`);
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
      } else {
        encodedMsg = encodeURIComponent("重複したユーザーIDです。ユーザーIDを変えて再度登録をお願いします。");
      }
    } catch (error) {
      request.log.error("ユーザーの新規登録中にエラーが発生しました:", error);
      encodedMsg = encodeURIComponent("ユーザーの新規登録中にエラーが発生しました");
      reply.redirect(`/register?msg=${encodedMsg}`);
    }
  }
  reply.redirect(`/register?msg=${encodedMsg}`);
});

fastify.get("/login", (request, reply) => {
  reply.sendFile("login.html");
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
        encodedMsg = encodeURIComponent("ログインに成功しました");
        reply.redirect(`/login?msg=${encodedMsg}`);
      }
    }
    encodedMsg = encodeURIComponent("ログインに失敗しました。ユーザーIDかパスワードが違います。");
    reply.redirect(`/login?msg=${encodedMsg}`);
  } catch (error) {
    request.log.error("ログインに失敗しました:", error);
    encodedMsg = encodeURIComponent("ログインに失敗しました");
    reply.redirect(`/login?msg=${encodedMsg}`);
  }
});

fastify.get("/editBlog", (request, reply) => {
  const articleId = request.query.id;
  if (request.session.user) {
    reply.sendFile("editBlog.html");
  } else {
    reply.redirect("/login");
  }
});

//記事の編集のために記事の情報を取得する処理
fastify.get("/editBlogPage", async (request, reply) => {
  const articleId = request.query.id;
  if (request.session.user) {
    try {
      const [rows] = await db.query(`SELECT id, article_title, content FROM articles where id = ?`, [articleId]);
      reply.send(rows[0]);
    } catch (error) {
      request.log.error("DBからの記事データ取得に失敗しました:", error);
      reply.sendFile("error.html");
    }
  } else {
    reply.redirect("/login");
  }
});

//記事の編集処理
fastify.post("/editBlog", async (request, reply) => {
  const articleTitle = request.body.articleTitle;
  const content = request.body.content;
  const articleId = request.body.id;
  let encodedMsg = "";
  if (request.session.user) {
    if (articleTitle.length > 255) {
      encodedMsg = encodeURIComponent("タイトルが255文字を超えています");
    } else if (content.length > 10000) {
      encodedMsg = encodeURIComponent("本文が10000文字を超えています");
    } else {
      try {
        const [result] = await db.query(`UPDATE articles set article_title = ?, content = ? where id = ?`, [articleTitle, content, articleId]);
        encodedMsg = encodeURIComponent("記事を保存しました");
      } catch (error) {
        request.log.error("記事の編集に失敗しました:", error);
        encodedMsg = encodeURIComponent("記事の編集に失敗しました");
      }
    }
    reply.redirect(`/detail?id=${articleId}&msg=${encodedMsg}`);
  } else {
    reply.redirect("/login");
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

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();