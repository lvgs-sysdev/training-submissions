const bcrypt = require('bcrypt');
const saltRounds = 10;

async function userRoutes(fastify, options) {

    //　新規登録
    fastify.post('/register', async (request, reply) => {
        const { user_id, password, user_name } = request.body;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            const [rows] = await fastify.mysql.query(
                'INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)',
                [user_id, hashedPassword, user_name]
            );

            if (rows.affectedRows > 0) {
                return { message: '新規登録が完了しました', user_id };
            } else {
                reply.code(500).send({ message: 'データベースエラー' });
            }
        } catch (error) {
            console.error('データベース挿入エラー:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                reply.code(409).send({ message: 'このユーザーIDはすでに登録されています' });
            } else {
                reply.code(500).send({ message: 'データベースエラー' });
            }
        }
    });

    //　ログイン
    fastify.post('/login', async (request, reply) => {
        const { user_id, password } = request.body;

        try {
            const [rows] = await fastify.mysql.query(
                'SELECT * FROM users WHERE user_id = ?',
                [user_id]
            );
            const user = rows[0];

            if (!user) {
                return reply.code(401).send({ message: 'ユーザーIDまたはパスワードが間違っています' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = fastify.jwt.sign({ user_id: user.user_id });
                    return reply.send({ token, user_id: user.user_id });
            }
        } catch (error) {
            console.error(error);
            reply.code(500).send({ message: 'ログイン処理中にエラーが発生しました。'});
        }
    });

    //　ユーザー情報の取得
    fastify.get('/profile',{ preHandler: [fastify.authenticate] }, async (request,reply) => {
        try {
            const { user_id } = request.user;
            const [rows] = await fastify.mysql.query(
                'SELECT user_id, user_name FROM users WHERE user_id = ?',
                [user_id]
            );

            if (rows.length === 0) {
                return reply.code(404).send({ message: 'ユーザーが見つかりませんでした' });
            }

            return { user: rows[0] };
        } catch (error) {
            reply.code(500).send({ message: 'プロフィールの取得に失敗しました'});
        }
    });

    // ユーザー情報の更新
    fastify.put('/profile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { user_id, user_name } = request.body;

        const originalUserId = request.user.user_id;

        try {
            const [rows] = await fastify.mysql.query(
                'UPDATE users SET user_id = ?, user_name = ? WHERE user_id = ?',
                [user_id, user_name, originalUserId]
            );

            if (rows.affectedRows > 0) {
                return { message: 'プロフィールの更新が完了しました' };
            } else {
                return reply.code(404).send({ message: 'ユーザーが見つかりませんでした'});
            }
        } catch (error) {
            console.error('データベース更新エラー:', error);
            reply.code(500).send({ message: 'プロフィールの更新に失敗しました' });
        }
    });
}

module.exports = userRoutes;
