const fastify = require("fastify")({ logger: true });
const path = require("path");
const mysql = require("mysql2/promise");

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

fastify.get("/", (req, reply) => {
  reply.sendFile("toppage.html");
});

//最新の記事情報を6つ取得
fastify.get("/articles", async (request, reply) => {
  try {
    const [rows, fields] = await db.query("SELECT id, article_title, SUBSTRING(content, 1, 20) AS content, updated_at FROM articles ORDER BY updated_at DESC LIMIT 6");
    reply.send(rows);
  } catch (error) {
    request.log.error('DBからのデータ取得に失敗しました:', error);
    reply.sendFile("error.html");
  }
});

fastify.get("/detail", (req, reply) => {
  reply.sendFile("detail.html");
});

//ユーザーがクリックした記事の情報を取得
fastify.get("/articleDetail", async (request, reply) => {
  const articleId = request.query.id;
  try {
    const [rows, fields] = await db.query(`SELECT art.article_title, art.content, user.user_name, user.user_id FROM articles art INNER JOIN users user ON art.user_id = user.user_id where art.id = ${articleId}`);
    reply.send(rows[0]);
  } catch (error) {
    request.log.error('DBからのデータ取得に失敗しました:', error);
    reply.sendFile("error.html");
  }
});

fastify.get("/user", (req, reply) => {
  reply.sendFile("user.html");
});

//ユーザーがクリックしたユーザーの情報を取得
fastify.get("/userDetail", async (request, reply) => {
  const userId = request.query.id;
  try {
    const [rows, fields] = await db.query(`SELECT user_id, user_name FROM users where user_id = ${userId}`);
    reply.send(rows[0]);
  } catch (error) {
    request.log.error('DBからのデータ取得に失敗しました:', error);
    reply.sendFile("error.html");
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();