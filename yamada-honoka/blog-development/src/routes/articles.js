const fastifyPlugin = require('fastify-plugin');

async function articleRoutes(fastify, options) {

    // 記事一覧取得
    fastify.get('/article', async (request, reply) => {
        try {
            const [rows] = await fastify.mysql.query(
                'SELECT * FROM articles ORDER BY updated_at DESC LIMIT 6'
            );
            reply.send(rows);
        } catch (error) {
            reply.code(500).send({ message: 'データベースエラー'});
        }
    });
    
    // 記事詳細取得
    fastify.get('/article/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const articleId = parseInt(id, 10);

            if (isNaN(articleId)) {
                return reply.code(400).send({ message: 'IDが不正です' });
            }

            const [rows] = await fastify.mysql.query(
                'SELECT * FROM articles WHERE id = ?',
                [articleId]
            );

            if (rows.length === 0 ) {
                return reply.code(404).send({ message: '記事が見つかりませんでした!!'});
            }
            reply.send(rows[0]);
        } catch (error) {
            reply.code(500).send({ message: 'データベースエラー'});
        }
    });

    // 自分の投稿記事一覧取得
    fastify.get('/my-articles', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { user_id } = request.user;
            const [rows] = await fastify.mysql.query(
                'SELECT * FROM articles WHERE user_id = ? ORDER BY updated_at DESC',
                [user_id]
            );
            reply.send(rows);
        } catch (error) {
            console.error('記事取得エラー:', error);
            reply.code(500).send({ message: 'データベースエラー' });
        }
    });

    // 自分の投稿記事編集
    fastify.put('/article/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { id } = request.params;
            const { article_title, content } = request.body;

            const [rows] = await fastify.mysql.query(
                'UPDATE articles SET article_title = ?, content = ?, updated_at = NOW() WHERE id = ?',
                [article_title, content, id]
            );

            if (rows.affectedRows > 0) {
                return reply.send({ message: '記事が正常に更新されました。' });
            } else {
                return reply.code(404).send({ message: '記事の更新に失敗しました。' });
            }
        } catch (error) {
            console.error('データベース更新エラー:', error);
            return reply.code(500).send({ message: 'データベースエラー' });
        }
    });
}

module.exports = fastifyPlugin(articleRoutes);