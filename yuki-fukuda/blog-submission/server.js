// 1. 必要なパッケージの読み込み
const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');

// 2. データベース接続プールの作成
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // 【修正1】ここにインストール時に設定したパスワードを入力してください
  database: 'yuki_webapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 3. ルーティング（トップページで記事一覧を表示）
fastify.get('/', async (request, reply) => {
  try {
    // 記事テーブルから全データを取得するSQL
    const [rows] = await pool.query('SELECT * FROM articles');
    
    // 取得したデータをログに出力（ターミナル確認用）
    console.log(rows);

    // ブラウザにそのままデータを返す（JSON形式で表示されます）
    return rows;

  } catch (err) {
    request.log.error(err);
    return { message: 'エラーが発生しました', error: err.message };
  }
});

// 4. サーバー起動
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('サーバーが起動しました: http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();