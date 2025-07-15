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

//最新の記事情報を6つ取得
fastify.get("/articles", async (request, reply) => {
  try {
    const [rows] = await db.query("SELECT id, article_title, SUBSTRING(content, 1, 20) AS content, updated_at FROM articles ORDER BY updated_at DESC LIMIT 6");
    reply.send(rows);
  } catch (error) {
    request.log.error("DBからのデータ取得に失敗しました:", error);
    reply.sendFile("error.html");
  }
});

fastify.get("/detail", (request, reply) => {
  reply.sendFile("detail.html");
});

//ユーザーがクリックした記事の情報を取得
fastify.get("/articleDetail", async (request, reply) => {
  const articleId = request.query.id;
  try {
    const [rows] = await db.query(`SELECT art.id, art.article_title, art.content, user.user_name, user.user_id FROM articles art INNER JOIN users user ON art.user_id = user.user_id where art.id = ?`, [articleId]);
    reply.send(rows[0]);
  } catch (error) {
    request.log.error("DBからのデータ取得に失敗しました:", error);
    reply.sendFile("error.html");
  }
});

fastify.get("/user", (request, reply) => {
  reply.sendFile("user.html");
});

//ユーザーがクリックしたユーザーの情報を取得
fastify.get("/userDetail", async (request, reply) => {
  const userId = request.query.id;
  try {
    const [rows] = await db.query(`SELECT user_id, user_name FROM users where user_id = ?`, [userId]);
    reply.send(rows[0]);
  } catch (error) {
    request.log.error("DBからのデータ取得に失敗しました:", error);
    reply.sendFile("error.html");
  }
});

fastify.get("/register", (request, reply) => {
  reply.sendFile("register.html");
});

//ユーザーの新規登録
fastify.post("/registerUser", async (request, reply) => {
  const userId = request.body.userId;
  const userName = request.body.userName;
  const password = request.body.password;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const [result] = await db.query(`INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)`, [userId, hashedPassword, userName]);
    reply.redirect("/register?success=true");
  } catch (error) {
    request.log.error("ユーザーの新規登録に失敗しました:", error);
    reply.redirect("/register?success=false");
  }
});

fastify.get("/login", (request, reply) => {
  reply.sendFile("login.html");
});

//ユーザーのログイン
fastify.post("/loginUser", async (request, reply) => {
  const userId = request.body.userId;
  const password = request.body.password;
  try {
    const [rows] = await db.query(`SELECT user_id, user_name, password FROM users where user_id = ?`, [userId]);
    if (rows.length > 0) {
      const isMatch = await bcrypt.compare(password, rows[0].password)
      if (isMatch) {
        request.session.user = { userId: rows[0].userId, userName: rows[0].userName };
        reply.redirect("/login?success=true");
      }
    }
    reply.redirect("/login?success=false");
  } catch (error) {
    request.log.error("ログインに失敗しました:", error);
    reply.redirect("/login?success=false");
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

//記事の編集ページ表示
fastify.get("/editBlogPage", async (request, reply) => {
  const articleId = request.query.id;
  if (request.session.user) {
    try {
      const [rows] = await db.query(`SELECT id, article_title, content FROM articles where id = ?`, [articleId]);
      reply.send(rows[0]);
    } catch (error) {
      request.log.error("DBからのデータ取得に失敗しました:", error);
      reply.sendFile("error.html");
    }
  } else {
    reply.redirect("/login");
  }
});

//記事の編集
fastify.post("/editBlog", async (request, reply) => {
  const articleTitle = request.body.articleTitle;
  const content = request.body.content;
  const articleId = request.body.id;
  if (request.session.user) {
    try {
      const [result] = await db.query(`UPDATE articles set article_title = ?, content = ? where id = ?`, [articleTitle, content, articleId]);
      reply.redirect(`/detail?id=${articleId}&success=true`);
    } catch (error) {
      request.log.error("記事の編集に失敗しました:", error);
      reply.redirect("/editBlog?success=false");
    }
  } else {
    reply.redirect("/login");
  }
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