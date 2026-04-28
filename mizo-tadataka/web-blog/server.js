//環境の構築
//ライブラリ導入と設定、ツールの導入
require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const fastifyMysql = require("@fastify/mysql");
const fastifyStatic = require("@fastify/static");
const path = require("path");
const argon2 = require("argon2");
const fastifyformBody = require("@fastify/formbody");
const fastifycookie = require("@fastify/cookie");
const fs = require("fs");
const fastifymultipart = require("@fastify/multipart");
const { pipeline } = require("stream/promises");
const crypto = require("crypto");
const { DESTRUCTION } = require("dns");

//プラグイン（拡張パーツ）の設定
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});
fastify.register(fastifyMysql, {
  promise: true,
  connectionString: process.env.DB_URL,
});
fastify.register(fastifyformBody);
fastify.register(fastifycookie, {
  secret: process.env.COOKIE_SECRET,
});
fastify.register(fastifymultipart);

//プログラム開始
//テスト
fastify.get("/api/v1/user", async (request, reply) => {
  const [rows] = await fastify.mysql.query(
    "SELECT * FROM tweet ORDER BY created_at DESC",
  );
  return rows;
});

//データの送信(新規登録)
fastify.post("/api/v1/register", async (request, reply) => {
  try {
    const { user_id, username, email, password } = request.body;
    const hashedPassword = await argon2.hash(password);
    await fastify.mysql.query(
      "INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)",
      [user_id, username, email, hashedPassword],
    );

    return reply.send({ message: "ユーザー登録完了！" });
  } catch (err) {
    fastify.log.error(err);
    if (error.code == "ER_DUP_ENTRY") {
      return reply
        .code(400)
        .send({ message: "すでにID、メールアドレスが使われています。" });
    }
    return reply.code(500).send({ message: "エラーです" });
  }
});

//データの照合および認証(ログイン)
fastify.post("/api/v1/login", async (request, reply) => {
  try {
    const { identifier, password } = request.body;
    //Dataを取ってくる
    const [users] = await fastify.mysql.query(
      "SELECT * FROM users WHERE email = ? OR user_id = ?",
      [identifier, identifier],
    );
    //検索結果が引っかからなかったとき
    if (users.length === 0) {
      return reply
        .code(401)
        .send({ message: "ユーザーが見つかりませんでした。" });
    }

    const user = users[0];

    //パスワード検証
    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return reply
        .code(401)
        .send({ message: " ユーザー名もしくはパスワードが異なります。" });
    }

    //クッキーの紐づけと設定、および発行
    reply.setCookie("userid", String(user.id), {
      path: "/",
      signed: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return {
      success: true, //成功フラグ
      message: "ログイン成功",
      username: user.username,
    };
  } catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ message: "サーバーエラー" });
  }
});

//一覧表示（全ての記事の中から、投稿日が新しい順に６つの記事を表示する）
fastify.get("/api/v1/list", async (request, reply) => {
  try {
    const [articles] = await fastify.mysql.query(
      `SELECT 
        a.article_id,
        a.article_title, 
        LEFT(a.content,50) AS summary,
        a.created_at,
        ai.file_name
      FROM articles a 
      LEFT JOIN article_images ai
      ON a.article_id = ai.article_id AND ai.is_main = 1
      ORDER BY a.created_at DESC
      LIMIT 6`,
    );
    return {
      success: true, //成功フラグ
      articles: articles,
    };
  } catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ message: "サーバーエラー" });
  }
});

//サーバーの起動
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port: port });
    console.log(`サーバーが ${port} 番にて開始`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
