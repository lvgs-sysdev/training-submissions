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

            const articleQuery = `
            SELECT articles.*, GROUP_CONCAT(tags.tag_name SEPARATOR ',') AS tag_names
            FROM articles
            LEFT JOIN article_tags ON articles.id = article_tags.article_id
            LEFT JOIN tags ON article_tags.tag_id = tags.id
            WHERE articles.id = ?
            GROUP BY articles.id;
            `;

            const [rows] = await fastify.mysql.query(
                articleQuery,
                [articleId]
            );

            if (rows.length === 0 ) {
                return reply.code(404).send({ message: '記事が見つかりませんでした!!'});
            }

            const articleData = rows[0];
            const tagsArray = articleData.tag_names ? articleData.tag_names.split(','): [];

            reply.send({
                id: articleData.id,
                article_title: articleData.article_title,
                content: articleData.content,
                user_id: articleData.user_id,
                updated_at: articleData.updated_at,
                tags: tagsArray
            });
        } catch (error) {
            console.error('記事詳細取得時のエラー:', error);
            reply.code(500).send({ message: 'データベースエラー'});
        }
    });

    // 自分の投稿記事一覧取得
    fastify.get('/my-articles', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { user_id } = request.user;

        const articleQuery = `
            SELECT 
                articles.*, GROUP_CONCAT(tags.tag_name SEPARATOR ',') AS tag_names
            FROM articles
            LEFT JOIN article_tags ON articles.id = article_tags.article_id
            LEFT JOIN tags ON article_tags.tag_id = tags.id
            WHERE articles.user_id = ?
            GROUP BY articles.id
            ORDER BY articles.updated_at DESC;
        `;

        const [rows] = await fastify.mysql.query(
            articleQuery,
            [user_id]);

        const articlesWithTags = rows.map(article => {
            return {
                ...article,
                tags: article.tag_names ? article.tag_names.split(','): []
            };
        });

        reply.send(articlesWithTags);
        
        } catch (error) {
            console.error('記事取得エラー:', error);
            reply.code(500).send({ message: 'データベースエラー' });
        }
    });

    // 自分の投稿記事編集
    fastify.put('/article/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { id } = request.params;
            const { article_title, content, tags } = request.body;
            const articleId = parseInt(id, 10);

            const tagNames = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length >0);

            const [updateArticleRows] = await fastify.mysql.query(
                'UPDATE articles SET article_title = ?, content = ?, updated_at = NOW() WHERE id = ?',
                [article_title, content, id]
            );

            await fastify.mysql.query(
                'DELETE FROM article_tags WHERE  article_id = ?',
                [articleId]);

            for (const tagName of tagNames) {
                let tagId;

                let [tagRows] = await fastify.mysql.query(
                    'SELECT id FROM tags WHERE tag_name = ?',
                    [tagName]);
                
                if (tagRows.length === 0) {
                    const [insertTag] = await fastify.mysql.query(
                    'INSERT INTO tags (tag_name) VALUE (?)',
                    [tagName]);
                    tagId = insertTag.insertId;
                } else {
                    tagId = tagRows[0].id;
                }

                await fastify.mysql.query(
                    'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
                    [articleId, tagId]
                );
            }

            if (updateArticleRows.affectedRows > 0) {
                return reply.send({ message: '記事とタグが正常に更新されました',
                    id: articleId
                });
            } else {
                return reply.code(404).send({ message: '記事の更新に失敗しました' });
            }
        } catch (error) {
            console.error('データベース更新エラー:', error);
            return reply.code(500).send({ message: 'データベースエラーが発生しました' });
        }
    });
}

module.exports = fastifyPlugin(articleRoutes);