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

// 3. ルーティング（トップページでDB接続テスト）
fastify.get('/', async (request, reply) => {
  try {
    // DBから時間を取得
    const [rows] = await pool.query('SELECT NOW() as now');
    
    // ★追加: ターミナルに中身を表示して確認する（デバッグ用）
    console.log('DBから取得したデータ:', rows);

    // 取得した時間をブラウザに表示
    return { 
      message: 'DB接続成功！', 
      db_time: rows.now  // ★ここに  をつけます！
    };

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