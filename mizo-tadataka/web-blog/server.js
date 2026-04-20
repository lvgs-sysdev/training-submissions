//環境の構築
//ライブラリ導入と設定、ツールの導入
const fastify = require("fastify")({ logger: true });
const { default: fastifyMysql } = require("@fastify/mysql");
const path = require("path");
//プラグイン（拡張パーツ）の設定
//フロント側の設定（ユーザーに見えるファイル）
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
});
//mysqlとfastifyの設定
fastify.register(require("@fastify/mysql"), {
  promise: true,
  connectionString: "mysql://root:@localhost/blog",
});
//プログラム開始
//mysqlとのやりとりの確認
fastify.get("/api/v1/articles", async (request, reply) => {
  const [rows] = await fastify.mysql.query(
    "SELECT * FROM tweet ORDER BY created_at DESC",
  );
  return rows;
});

//サーバーの起動
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("サーバーが3000番にて開始");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
