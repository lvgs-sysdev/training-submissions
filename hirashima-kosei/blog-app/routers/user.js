const mysql = require('mysql2/promise');
const pool = mysql.createPool(require('../db-config'));

const authorizeToken = require('../authorize-token');

async function userRoutes(fastify) {
	fastify.get('/api/user/loginUser', async (request, reply) => {
		const accessToken = request.cookies?.accessToken;

		let userId = null;

		if (!accessToken) {
			return reply.status(204).send({ msg: '非ログインユーザー', user: null });
		}

		// ログインユーザーアクセス時のみアクセストークンの検証、リフレッシュ処理
		try {
			const decoded = await authorizeToken(accessToken);
			userId = decoded.id;
		} catch (e) {
			return reply.status(401).send({ error: 'トークンの検証に失敗しました。' });
		}

		try {
			const [userRows] = await pool.query('SELECT * FROM users WHERE user_id=?', [userId]);
			if (!userRows || userRows.length === 0) {
				return reply.status(500).send({ error: '登録されていないユーザーです。' });
			}

			const user = userRows[0];
			return reply.send({ msg: 'ログインユーザー', user });
		} catch (err) {
			return reply.status(500).send({ error: 'ログイン状態の取得に失敗しました。' });
		}
	});

	fastify.get('/api/user/profile', async (request, reply) => {
		const accessToken = request.cookies?.accessToken;
		const userId = request.query.userId;

		let editProfileFlg = false;

		// ログインユーザーアクセス時のみアクセストークンの検証、リフレッシュ処理
		if (accessToken) {
			try {
				const decoded = await authorizeToken(accessToken);
				if (userId === decoded.id) {
					editProfileFlg = true;
				}
			} catch (e) {
				return reply.status(401).send({ error: 'トークンの検証に失敗しました。' });
			}
		}

		try {
			const [userRows] = await pool.query('SELECT * FROM users WHERE user_id=?', [userId]);
			if (!userRows || userRows.length === 0) {
				return reply.status(500).send({ error: '登録されていないユーザーです。' });
			}

			const user = userRows[0];
			user.editProfileFlg = editProfileFlg;
			return reply.send({ user });
		} catch (err) {
			return reply.status(500).send({ error: 'ユーザープロフィールの取得に失敗しました。' });
		}
	});

	fastify.put('/api/user/editProfile', async (request, reply) => {
		const { id, beforeUserId, afterUserId, userName } = request.body;

		const accessToken = request.cookies?.accessToken;

		let editProfileFlg = false;

		if (!accessToken) {
			return reply.status(401).send({ error: '編集するにはログインが必要です。' });
		}

		try {
			const decoded = await authorizeToken(accessToken);
			if (beforeUserId === decoded.id) {
				editProfileFlg = true;
			}
		} catch (e) {
			return reply.status(401).send({ error: 'トークンの検証に失敗しました。' });
		}

		if (!editProfileFlg) {
			return reply.code(409).send({ error: '自分以外のユーザーは編集できません。' });
		}

		try {
			await pool.query('UPDATE users SET user_id=?, user_name=? WHERE id=?', [
				afterUserId,
				userName,
				id,
			]);
			return reply.status(200).send({ msg: '更新成功！' });
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY') {
				return reply.code(409).send({ error: 'このユーザーIDは既に使われています。' });
			}
			return reply.status(500).send({ error: 'プロフィールの更新に失敗。' });
		}
	});
}

module.exports = userRoutes;
