// server.js (ES Modules 形式)

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyPostgres from 'fastify-postgres';
import 'dotenv/config';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import bcrypt from 'bcrypt';

// Fastify インスタンスを作成
// (ESMでは Fastify({ ... }) のように呼び出します)
const fastify = Fastify({ logger: true });

// 1. CORSプラグインの登録
fastify.register(fastifyCors, {
  // ここにCORSのオプションを設定
  origin: 'http://localhost:5173', // (例: Viteを使うフロントエンド開発サーバー)
  // origin: 'https://your-frontend-domain.com', // (例: 本番環境のフロントエンドドメイン)
  // origin: true, // (例: すべてのオリジンを許可する場合 ※非推奨)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 許可するHTTPメソッド
});

// 2. fastify-postgres プラグインの登録 (環境変数を使用)
fastify.register(fastifyPostgres, {
  // process.env オブジェクトから .env ファイルで定義した名前で読み込む
  connectionString: process.env.DATABASE_URL
});

// 2. Cookie (Sessionが依存)
fastify.register(fastifyCookie);

// 3. Session
// 'secret' は本番環境では必ず推測困難な長い文字列に変更してください
fastify.register(fastifySession, {
  secret: 'a-very-strong-secret-key-32-chars-long-or-more',
  cookie: {
    secure: false, // 本番環境でHTTPSを使う場合は 'true' に設定
    httpOnly: true, // JavaScriptからCookieを読めなくする (XSS対策)
    maxAge: 60 * 60 * 1000, // セッションの有効期限 (例: 1時間)
    sameSite: 'lax'
  },
  saveUninitialized: false // 変更がないセッションは保存しない
});

const allowedColumns = ['article_title', 'content'];

// --- APIエンドポイントの実装 ---

// C: Create - 新しいアイテムを作成
fastify.post('/items', async (request, reply) => {
  const { name, description } = request.body;
  if (!name) {
    return reply.status(400).send({ error: 'Name is required' });
  }

  try {
    const { rows } = await fastify.pg.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return reply.status(201).send(rows[0]);
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Database error' });
  }
});

// R: Read (All) - すべてのアイテムを取得
fastify.get('/detail', async (request, reply) => {
  try {
    const { rows } = await fastify.pg.query('SELECT id, article_title, content, content, user_id, updated_at, picture FROM articles ORDER BY updated_at DESC LIMIT 6;');
    return rows;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Database error' });
  }
});

// R: Read (by ID) - IDで特定のアイテムを取得
fastify.get('/detail/:id', async (request, reply) => {
  const { id } = request.params;
 
  try {
    const { rows } =  await fastify.pg.query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );

    const user_id = rows[0].user_id;

    // $1 プレースホルダーでSQLインジェクション対策
    const { rows: resultArticle } = await fastify.pg.query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );
    
    const { rows: resultAuthor }= await fastify.pg.query(
      'SELECT * FROM users WHERE user_id = $1',
      [user_id]
    );

    const articleInfo = resultArticle[0];
    const authorInfo = resultAuthor[0];

    if (articleInfo.length === 0) {
      return reply.status(404).send({ error: 'Article not found' });
    }
    return {
      articleInfo: articleInfo,
      authorInfo: authorInfo
    }; // 見つかったデータを返す
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Database error' });
  }
});

// U: Update (by ID) - IDで特定のアイテムを更新
fastify.patch('/editBlog/:id', async (request, reply) => {
  const { id } = request.params;
  const body = request.body;

  const keys = Object.keys(body);
  const values = Object.values(body);

  const fieldToUpdate = keys[0];
  const contenToUpdate = values[0];

  if (!contenToUpdate) {
    return reply.status(400).send({ error: 'Name is required' });
  }
  
  if (allowedColumns.includes(fieldToUpdate)) {
    const columnName = fieldToUpdate;

    console.log(`更新対象は${columnName}`);

    console.log(request.session.user);

//  ❤️ここに実装していく
    if (!request.session.user) {
        return reply.status(401).send({ message: 'ログインしていません' });
      }

    const { user_id: loggedInUserId } = request.session.user;

    console.log(loggedInUserId);

    // 2. DBから「この記事の持ち主(user_id)」を取得
    const { rows } = await fastify.pg.query(
      'SELECT user_id FROM articles WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return reply.status(404).send({ message: '記事が見つかりません' });
    }

    const article = rows[0];

    if (article.user_id !== loggedInUserId) {
      // 一致しない場合、403 Forbidden (禁止) エラーを返す
      fastify.log.warn(`Forbidden: User ${loggedInUserId} tried to edit article ${articleId} owned by ${article.user_id}`);
      return reply.status(403).send({ message: 'この記事を編集する権限がありません' });
    }
//  ❤️ 
    try {
    // $1, $2プレースホルダーを使用
    const { rows } = await fastify.pg.query(
      `UPDATE articles SET ${columnName} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [contenToUpdate, id]
    );

    if (rows.length === 0) {
      return reply.status(404).send({ error: 'Item not found' });
    }
    return rows[0]; // 更新後のデータを返す
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Database error' });
  }
  }else{
    console.log('error');
  }
});

// D: Delete (by ID) - IDで特定のアイテムを削除
fastify.delete('/dtail/:id', async (request, reply) => {
  const { id } = request.params;

  try {
    const { rowCount } = await fastify.pg.query(
      'DELETE FROM items WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return reply.status(404).send({ error: 'Item not found' });
    }
    return reply.status(204).send(); // 成功時 (No Content)
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Database error' });
  }
});

/**
 * ユーザー登録APIエンドポイント
 */
fastify.post('/register', async (request, reply) => {
    try {
        const { username, user_id, password } = request.body;

        // 1. バリデーション (簡易)
        if (!username || !user_id || !password) {
            return reply.status(400).send({ message: '必須項目が不足しています。' });
        }
        
        // 2. パスワードのハッシュ化
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. データベースへの挿入
        // SQLインジェクション対策のため、プレースホルダー ($1, $2, $3) を使う
        const { rows } = await fastify.pg.query(
          `
            INSERT INTO users (user_name, user_id, password)
            VALUES ($1, $2, $3)
            RETURNING user_name, user_id, password;
        `, 
          [username, user_id, passwordHash]
        );

        // 4. 成功レスポンス
        fastify.log.info(`ユーザー登録成功: ${rows[0].username}`);
        return reply.status(201).send({ 
            message: 'ユーザー登録が成功しました。',
            user: rows[0] 
        });

    } catch (error) {
        fastify.log.error(error);

        // 5. エラーハンドリング (メールアドレスやユーザー名の重複など)
        if (error.code === '23505') { // unique_violation (一意制約違反)
            if (error.constraint.includes('user_id')) {
                return reply.status(409).send({ message: 'このuser_idは既に使用されています。' });
            }
            if (error.constraint.includes('username')) {
                return reply.status(409).send({ message: 'このユーザー名は既に使用されています。' });
            }
        }

        // その他のサーバーエラー
        return reply.status(500).send({ message: 'サーバーエラーが発生しました。' });
    }
});


/**
 * ログイン処理 (POST /login)
 */
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.status(400).send({ message: 'ユーザー名とパスワードは必須です' });
  }

  let client;
  try {
    // DBからユーザーを検索
    client = await fastify.pg.connect();
    const { rows } = await client.query(
      'SELECT id, user_id, password, user_name, picture FROM users WHERE user_name = $1',
      [username]
    );

    if (rows.length === 0) {
      // ユーザーが存在しない
      fastify.log.warn(`Login attempt failed: user not found (${username})`);
      return reply.status(401).send({ message: '認証情報が正しくありません' });
    }

    const user = rows[0];

    // 5. パスワードの比較 (入力されたPWとDBのハッシュを比較)
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // 6. 認証成功！ セッションにユーザー情報を保存
      // (パスワードハッシュはセッションに含めないこと！)
      request.session.user = {
        id: user.id,
        username: user.user_name,
        photoUrl: user.picture,
        user_id: user.user_id
      };

      fastify.log.info(`Login successful: ${user.username}`);
      return reply.send({ message: 'ログイン成功', user: request.session.user }); 
      // ここでreturnしているから外部からもrequest.session.userが使えるの？

    } else {
      // パスワードが不一致
      fastify.log.warn(`Login attempt failed: invalid password (${username})`);
      return reply.status(401).send({ message: '認証情報が正しくありません' });
    }

  } catch (err) {
    fastify.log.error(err, 'Login error');
    return reply.status(500).send({ message: 'サーバーエラーが発生しました' });
  } finally {
    // DB接続を解放
    if (client) {
      client.release();
    }
  }
});




/**
 * 7. ユーザー情報取得 (GET /me)
 * (ヘッダー表示用: ログイン状態の確認)
 */
fastify.get('/user', async (request, reply) => {
  // セッションに 'user' オブジェクトが存在するかチェック
  if (request.session.user) {
    // ログイン済み: セッションに保存されたユーザー情報を返す
    return reply.send(request.session.user);
  } else {
    // 未ログイン
    return reply.status(401).send({ message: 'ログインしていません' });
  }
});




/**
 * 8. ログアウト処理 (POST /logout)
 */
fastify.post('/logout', async (request, reply) => {
  if (request.session.user) {
    const username = request.session.user.username;
    // セッションを破棄
    await request.session.destroy();
    fastify.log.info(`User logged out: ${username}`);
    return reply.send({ message: 'ログアウトしました' });
  } else {
    return reply.status(400).send({ message: 'ログインしていません' });
  }
});






// --- サーバーの起動 ---
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();