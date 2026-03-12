require("dotenv").config();

// 1. 必要なパッケージの読み込み
const path = require("path");
const fs = require("fs");
const { pipeline } = require("stream/promises");
const mysql = require("mysql2/promise");

const httpsOptions = {
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
  },
};

const fastify = require("fastify")(httpsOptions);

fastify.register(require("@fastify/cookie"));
fastify.register(require("@fastify/session"), {
  // ※32文字以上の適当な長い文字列にしてください
  secret: process.env.SESSION_SECRET_KEY,
  cookie: {
    secure: true,
    maxAge: 3600000, // 1時間（ミリ秒）有効にするなどの設定
  },
});

fastify.register(require("@fastify/multipart"), {
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// publicフォルダを静的ファイルとして公開する設定
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // URLの最初から探す設定
});

fastify.register(require("@fastify/cors"), {
  origin: process.env.FRONTEND_URL,
  credentials: true,
});

// 2. データベース接続プールの作成
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// .ポート番号を.envから取得、ない場合は3000を使う。
const PORT = process.env.PORT || 3000;

// DB接続をどこでも使えるようにする。
fastify.decorate("db", pool);

// 3. ルーティング（トップページで記事一覧を表示）
fastify.get("/", async (request, reply) => {
  try {
    // 記事テーブルから最新の6件を取得するSQL
    const [rows] = await pool.query(
      "SELECT * FROM articles ORDER BY updated_at DESC LIMIT 6",
    );

    // 取得したデータをログに出力（ターミナル確認用）
    console.log(rows);

    // ブラウザにそのままデータを返す（JSON形式で表示されます）
    return rows;
  } catch (err) {
    request.log.error(err);
    return { message: "エラーが発生しました", error: err.message };
  }
});

fastify.get("/article-detail/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const [rows] = await pool.query(
      `SELECT a.*, u.user_name 
        FROM articles a 
        JOIN users u ON a.user_id = u.user_id
        WHERE a.id = ?`,
      [id],
    );
    if (rows.length === 0) {
      return reply.status(404).send({ message: "記事がみつかりません" });
    }
    return rows[0];
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send(err);
  }
});

// プロフィール取得用のルート
fastify.get("/get-profile/:id", async (request, reply) => {
  const { id } = request.params;
  const [rows] = await pool.query(
    "SELECT user_id, user_name FROM users WHERE user_id = ?",
    [id],
  );
  return rows[0];
});

// プロフィール情報更新用のルート
fastify.post("/update-profile", async (request, reply) => {
  const { old_id, new_id, new_name } = request.body;
  try {
    await pool.query(
      "UPDATE users SET user_id = ?, user_name = ? WHERE user_id = ?",
      [new_id, new_name, old_id],
    );
    return { success: true };
  } catch (err) {
    reply.status(500).send({
      error: "更新に失敗しました。IDが重複している可能性があります。",
    });
  }
});

// プロフィール画面で記事を取得するルート
fastify.get("/my-articles", async (request, reply) => {
  const user = request.session.user;

  if (!user) {
    return reply.status(401).send({ message: "ログインが必要です" });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM articles WHERE user_id = ? ORDER BY updated_at DESC",
      [user.user_id],
    );
    return rows;
  } catch (err) {
    return reply.status(500).send({ error: err.message });
  }
});

// 編集前の記事表示
fastify.get("/article/:id", async (request, reply) => {
  const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [
    request.params.id,
  ]);
  // ここで image_path が含まれるように SELECT されているか？
  return rows[0];
});

// ブラウザからの記事編集リクエストの対応
fastify.post("/edit-blog", async (request, reply) => {
  const user = request.session.user;
  if (!user) return reply.code(401).send({ error: "ログインが必要です" });

  const parts = request.parts();
  let id, new_title, new_content, image_path;

  for await (const part of parts) {
    if (part.file) {
      // ファイル名が存在する場合のみ保存処理を行う
      if (part.filename && part.filename !== "") {
        const fileName = `${Date.now()}-${part.filename}`;
        const savePath = path.join(__dirname, "public/uploads", fileName);
        await pipeline(part.file, fs.createWriteStream(savePath));
        image_path = fileName; // ここで画像パスを代入
      } else {
        await part.file.resume();
      }
    } else {
      // テキストデータの受け取り
      if (part.fieldname === "id") id = part.value;
      if (part.fieldname === "new_title") new_title = part.value;
      if (part.fieldname === "new_content") new_content = part.value;
    }
  }

  try {
    // 画像がある場合とない場合でSQLを分ける
    if (image_path) {
      await pool.query(
        "UPDATE articles SET article_title = ?, content = ?, image_path = ? WHERE id = ? AND user_id = ?",
        [new_title, new_content, image_path, id, user.user_id],
      );
    } else {
      // 画像が送られてこない場合は image_path は更新しない（元のまま）
      await pool.query(
        "UPDATE articles SET article_title = ?, content = ? WHERE id = ? AND user_id = ?",
        [new_title, new_content, id, user.user_id],
      );
    }
    return { success: true };
  } catch (err) {
    console.error("SQL実行エラー:", err);
    reply.status(500).send({ error: "DB更新に失敗しました" });
  }
});

// 記事投稿用ルート
fastify.post("/post-article", async (request, reply) => {
  const auth = request.session.get("user");

  if (!auth) {
    return reply.status(401).send({ message: "ログインが必要です" });
  }

  const parts = request.parts();
  let title, content, image_path;

  for await (const part of parts) {
    if (part.file) {
      if (part.filename) {
        const fileName = `${Date.now()}${part.filename}`;
        const savePath = path.join(__dirname, "public/uploads", fileName);

        await pipeline(part.file, fs.createWriteStream(savePath));
        image_path = fileName;
      } else {
        await part.file.resume();
      }
    } else {
      if (part.fieldname === "title") title = part.value;
      if (part.fieldname === "content") content = part.value;
    }
  }

  try {
    await pool.query(
      "INSERT INTO articles (user_id, article_title, content, image_path, updated_at) VALUES (?, ?, ?, ?, NOW())",
      [auth.user_id, title, content, image_path || null],
    );
    return { success: true, message: "記事を保存しました" };
  } catch (err) {
    request.log.error(err);
    return reply
      .status(500)
      .send({ message: "保存に失敗しました", error: err.message });
  }
});

// 画像アップロード用ルート
fastify.post("/api/upload", async (request, reply) => {
  const data = await request.file();
  if (!data) {
    return reply.status(400).send({ message: "ファイルが見つかりません" });
  }

  const fileName = "${Date.now()}-${data.filename}";
  const uploadPath = path.join(__dirname, "public/images", fileName);

  try {
    await pipeline(data.file, fs.createWriteStream(uploadPath));

    return {
      success: true,
      fileName: fileName,
      url: "/public/images/${fileName}",
    };
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ message: "保存に失敗しました" });
  }
});

// register.jsのルートを登録
fastify.register(require("./src/auth.js"));

// 4. サーバー起動
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log(`サーバーが起動しました: https://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
