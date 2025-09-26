const mysql = require('mysql2/promise');
const pool = mysql.createPool(require('../db-config'));

const authorizeToken = require('../authorize-token');

async function blogRoutes(fastify) {
	fastify.get('/api/blog/count', async (request, reply) => {
		const limit = parseInt(request.query.limit);
		const userId = request.query.userId;

		try {
			let countRows = [];
			if (userId === '') {
				[countRows] = await pool.query('SELECT COUNT(*) as count FROM articles');
			} else {
				[countRows] = await pool.query(
					'SELECT COUNT(*) as count FROM articles WHERE user_id=?',
					[userId]
				);
			}

			const countAllItems = countRows[0].count;
			const countAllPages = Math.ceil(countAllItems / limit);

			return reply.send({ countAllPages });
		} catch (err) {
			return reply.status(500).send({ error: 'ページ数の取得に失敗。' });
		}
	});

	fastify.get('/api/blog/list', async (request, reply) => {
		const page = parseInt(request.query.page);
		const limit = parseInt(request.query.limit);
		const offset = limit * (page - 1);
		const userId = request.query.userId;

		try {
			let pageItems = [];
			if (userId === '') {
				[pageItems] = await pool.query(
					'SELECT * FROM articles ORDER BY updated_at DESC LIMIT ? OFFSET ?',
					[limit, offset]
				);
			} else {
				[pageItems] = await pool.query(
					'SELECT * FROM articles WHERE user_id=? ORDER BY updated_at DESC LIMIT ? OFFSET ?',
					[userId, limit, offset]
				);
			}

			return reply.send({ pageItems });
		} catch (err) {
			return reply.status(500).send({ error: '一覧の取得に失敗。' });
		}
	});

	fastify.get('/api/blog/article', async (request, reply) => {
		const articleId = request.query.id;
		const accessToken = request.cookies?.accessToken;

		let editArticleFlg = false;

		try {
			// ログインしている場合、検証したトークンをデコードしたIDと記事作成者のIDが同じであれば記事編集可能
			if (accessToken) {
				try {
					const [authorIdRows] = await pool.query(
						'SELECT user_id FROM articles WHERE id=?',
						[articleId]
					);

					if (!authorIdRows || authorIdRows.length === 0) {
						return reply.status(404).send({ error: '記事作成者が見つかりません。' });
					}
					const decoded = await authorizeToken(accessToken);

					// 閲覧している記事の作者とログインユーザーが同じであれば編集可能
					// そうでなければ編集不可能だがページは正しくみられる状態
					if (authorIdRows[0].user_id === decoded.id) {
						editArticleFlg = true;
					}
				} catch (e) {
					return reply.status(401).send({ error: 'トークンの検証に失敗しました。' });
				}
			}

			const [articleDetailsRows] = await pool.query(
				'SELECT A.article_title, A.content, U.user_name, U.user_icon, A.updated_at FROM articles AS A LEFT JOIN users AS U ON A.user_id=U.user_id WHERE A.id=?',
				[articleId]
			);

			if (!articleDetailsRows || articleDetailsRows.length === 0) {
				return reply.status(404).send({ error: '記事が見つかりません。' });
			}

			articleDetailsRows[0].editArticleFlg = editArticleFlg;

			return reply.send({ articleDetails: articleDetailsRows[0] });
		} catch (err) {
			return reply.status(500).send({ error: '記事の取得に失敗しました。' });
		}
	});

	fastify.put('/api/blog/editBlog', async (request, reply) => {
		const { id, articleTitle, content } = request.body;
		const accessToken = request.cookies?.accessToken;

		let editArticleFlg = false;

		if (!accessToken) {
			return reply.status(401).send({ error: '編集するにはログインが必要です。' });
		}

		try {
			const [authorIdRows] = await pool.query('SELECT user_id FROM articles WHERE id=?', [
				id,
			]);

			if (!authorIdRows || authorIdRows.length === 0) {
				return reply.status(404).send({ error: '記事作成者が見つかりません。' });
			}

			try {
				const decoded = await authorizeToken(accessToken);
				if (authorIdRows[0].user_id === decoded.id) {
					editArticleFlg = true;
				}
			} catch (e) {
				return reply.status(401).send({ error: 'トークンの検証に失敗しました。' });
			}

			if (!editArticleFlg) {
				return reply.status(403).send({ error: '自分の記事以外は編集できません。' });
			}

			await pool.query(
				'UPDATE articles SET article_title=?, content=?, updated_at=NOW() WHERE id=?',
				[articleTitle, content, id]
			);

			return reply.status(200).send({ msg: '更新成功！' });
		} catch (err) {
			return reply.status(500).send({ error: '記事の更新に失敗。' });
		}
	});
}

module.exports = blogRoutes;
