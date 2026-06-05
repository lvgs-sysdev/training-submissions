require('dotenv').config();

const path = require('path');
const fs = require('fs');
const fastifyMultipart = require('@fastify/multipart');
const fastifyStatic = require('@fastify/static');

const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');

// プラグインの登録
fastify.register(fastifyMultipart);

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', 
});

fastify.register(require('@fastify/cors'), {
    origin: 'http://127.0.0.1:5500', 
    credentials: true,                
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization']     
});

fastify.register(require('@fastify/cookie'), {
    secret: "my-secret-key",
    hook: 'onRequest'
});

// データベース接続プール設定
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * 記事一覧取得 API (最新6件)
 */
fastify.get('/', async (request, reply) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, article_title, content, updated_at, article_image, category FROM articles ORDER BY updated_at DESC LIMIT 6'
        );

        // 本文が30文字を超える場合は切り詰め処理を行う
        const processedData = rows.map(article => {
            let shortContent = article.content;
            if (shortContent && shortContent.length > 30) {
                shortContent = shortContent.substring(0, 30) + '...';
            }
            return {
                id: article.id,
                article_title: article.article_title,
                content: shortContent,
                updated_at: article.updated_at,
                article_image: article.article_image,
                category: article.category
            };
        });

        return processedData;

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'データベースからデータを取得できませんでした' });
    }
});

/**
 * 記事詳細取得 API
 */
fastify.get('/detail', async (request, reply) => {
    try {
        const { id } = request.query;
        if (!id) {
            return reply.status(400).send({ error: '記事IDが指定されていません' });
        }

        const [rows] = await pool.query(
            `SELECT
                a.article_title,
                a.content,
                a.updated_at,
                a.article_image,
                u.user_name,
                u.user_id AS author_id,
                u.profile_image
             FROM articles AS a
             JOIN users AS u ON a.user_id = u.id
             WHERE a.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return reply.status(404).send({ error: '指定された記事が見つかりませんでした' });
        }

        return rows[0];

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'データベースから詳細データを取得できませんでした' });
    } 
});

/**
 * ユーザー新規登録 API
 */
fastify.post('/register', async (request, reply) => {
    const { userId, userName, password } = request.body;
    if (!userId || !userName || !password) {
        return reply.code(400).send({ success: false, message: 'すべての項目を入力してください' });
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (existingUser.length > 0) {
            return reply.code(400).send({ success: false, message: 'このユーザーIDはすでに使用されています。' });
        }

        await pool.query(
            'INSERT INTO users (user_id, user_name, password) VALUES (?, ?, ?)',
            [userId, userName, password]
        );

        return { success: true, message: 'ユーザー登録が完了しました！' };

    } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ success: false, message: 'サーバーエラーが発生しました。' });
    }
});

/**
 * ユーザーログイン API
 */
fastify.post('/login', async (request, reply) => {
    const { userId, password } = request.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            return { success: false, message: 'ユーザーIDまたはパスワードが違います。' };
        }

        const user = rows[0];
        if (user.password !== password) {
            return { success: false, message: 'ユーザーIDまたはパスワードが違います。' };
        }

        return { 
            success: true, 
            message: 'ログインに成功しました！',
            user: {
                userId: user.user_id,
                userName: user.user_name
            }
        };

    } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ success: false, message: 'サーバーでエラーが発生しました。' });
    }
});

/**
 * ユーザープロフィール ＆ 投稿一覧取得 API
 */
fastify.get('/user', async (request, reply) => {
    try {
        const userId = request.query.userId || 'test@example.com';

        // プロフィール情報の取得
        const [userRows] = await pool.query(
            'SELECT user_id, user_name, email, profile_image FROM users WHERE user_id = ?',
            [userId]
        );
        
        if (userRows.length === 0) {
            return reply.status(404).send({ error: 'ユーザーが見つかりません' });
        }
        const userInfo = userRows[0];

        // 該当ユーザーの過去投稿一覧の取得
        const [articleRows] = await pool.query(
            `SELECT a.id, a.article_title, a.content, a.updated_at 
             FROM articles a
             INNER JOIN users u ON a.user_id = u.id
             WHERE u.user_id = ?
             ORDER BY a.updated_at DESC`,
            [userId]
        );

        return {
            user: userInfo,
            articles: articleRows
        };

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'プロフィールデータの取得に失敗しました' });
    }
});

/**
 * ユーザーID変更 API
 */
fastify.put('/user/update-id', async (request, reply) => {
    try {
        const { userId, newUserId } = request.body;
        if (!userId || !newUserId) {
            return reply.status(400).send({ error: 'データが不足しています' });
        }

        await pool.query(
            'UPDATE users SET user_id = ? WHERE user_id = ?',
            [newUserId, userId]
        );

        return { success: true, message: 'ユーザーIDを更新しました！' };

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'ユーザーIDの更新に失敗しました' });
    }
});

/**
 * ユーザー名変更 API
 */
fastify.put('/user/update-name', async (request, reply) => {
    try {
        const { userId, newUserName } = request.body;
        if (!userId || !newUserName) {
            return reply.status(400).send({ error: 'データが不足しています' });
        }

        await pool.query(
            'UPDATE users SET user_name = ? WHERE user_id = ?',
            [newUserName, userId]
        );

        return { success: true, message: 'ユーザー名を更新しました！' };

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'ユーザー名の更新に失敗しました' });
    }
});

/**
 * メールアドレス変更 API
 */
fastify.put('/user/update-email', async (request, reply) => {
    try {
        const { userId, newEmail } = request.body;
        if (!userId || !newEmail) {
            return reply.status(400).send({ error: 'データが不足しています' });
        }

        await pool.query(
            'UPDATE users SET email = ? WHERE user_id = ?',
            [newEmail, userId]
        );

        return { success: true, message: 'メールアドレスを更新しました！' };

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'メールアドレスの更新に失敗しました' });
    }
});

/**
 * アバター画像アップロード API
 */
fastify.post('/user/update-avatar', async (request, reply) => {
    try {
        const data = await request.file();
        if (!data) {
            return reply.status(400).send({ error: 'ファイルがありません' });
        }

        const userId = data.fields.userId.value;
        const filename = `${Date.now()}_${data.filename}`;
        const uploadPath = path.join(__dirname, 'public', 'uploads', filename);

        // 物理ファイルを指定ディレクトリへストリーム保存
        await new Promise((resolve, reject) => {
            const outStream = fs.createWriteStream(uploadPath);
            data.file.pipe(outStream);
            data.file.on('end', resolve);
            outStream.on('error', reject);
        });

        // データベースのプロフィール画像パスを更新
        await pool.query(
            'UPDATE users SET profile_image = ? WHERE user_id = ?',
            [filename, userId]
        );

        return { success: true, message: 'アイコンを変更しました！', filename: filename };

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: '画像のアップロードに失敗しました' });
    }
});

/**
 * 記事更新 API
 */
fastify.put('/article/update', async (request, reply) => {
    try {
        const { id, article_title, content } = request.body;
        if (!id || !article_title || !content) {
            return reply.status(400).send({ success: false, message: '必要なデータが不足しています' });
        }

        const [result] = await pool.query(
            'UPDATE articles SET article_title = ?, content = ?, updated_at = NOW() WHERE id = ?',
            [article_title, content, id]
        );

        if (result.affectedRows === 0) {
            return reply.status(404).send({ success: false, message: '該当する記事が見つかりませんでした。' });
        }

        return { success: true, message: '記事を正常に更新しました！' };

    } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ success: false, message: 'サーバー側で更新エラーが発生しました。' });
    }
});

// サーバー起動処理
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('サーバーがポート3000で起動しました!'); 
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();