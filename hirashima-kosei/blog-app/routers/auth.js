require('dotenv').config();

const mysql = require('mysql2/promise');
const pool = mysql.createPool(require('../db-config'));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

async function authRoutes(fastify) {
	fastify.post('/api/auth/register', async (request, reply) => {
		const { userId, password, userName } = request.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			await pool.query('INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)', [
				userId,
				hashedPassword,
				userName,
			]);
			return reply.send({ msg: '登録完了！ログインしてください。' });
		} catch (err) {
			if (err.code === 'ER_DUP_ENTRY') {
				return reply.code(409).send({ error: 'このユーザーIDは既に使われています。' });
			}
			return reply.code(500).send({ error: '登録できませんでした。' });
		}
	});

	fastify.post('/api/auth/login', async (request, reply) => {
		const { userId, password } = request.body;

		try {
			const [userRows] = await pool.query('SELECT * FROM users WHERE user_id=?', [userId]);
			if (!userRows || userRows.length === 0) {
				return reply.status(401).send({ error: '入力内容に誤りがあります。' });
			}

			const user = userRows[0];

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return reply.status(401).send({ error: '入力内容に誤りがあります。' });
			}

			const accessToken = jwt.sign({ id: user.user_id }, process.env.SECRET_KEY, {
				expiresIn: '1m',
			});

			const refreshToken = uuidv4();

			// リフレッシュトークンはユーザーIDと紐づけてDB保存
			await pool.query('UPDATE users SET refresh_token=? WHERE user_id=?', [
				refreshToken,
				user.user_id,
			]);

			return reply
				.setCookie('accessToken', accessToken, {
					path: '/api',
					maxAge: 15 * 60,
					httponly: true,
				})
				.setCookie('refreshToken', refreshToken, {
					path: '/api',
					maxAge: 7 * 24 * 60 * 60,
					httponly: true,
				})
				.send({ msg: 'ログイン成功！' });
		} catch (err) {
			return reply.status(500).send({ error: 'ログインできませんでした。' });
		}
	});

	// アクセストークン再発行用API
	fastify.post('/api/auth/refresh', async (request, reply) => {
		const refreshToken = request.cookies.refreshToken;

		try {
			const [userRows] = await pool.query('SELECT * FROM users WHERE refresh_token=?', [
				refreshToken,
			]);
			if (!userRows || userRows.length === 0) {
				return reply.status(401).send({ error: '再度ログインしてください。' });
			}

			const user = userRows[0];

			const newAccessToken = jwt.sign({ id: user.user_id }, process.env.SECRET_KEY, {
				expiresIn: '15m',
			});

			return reply
				.setCookie('accessToken', newAccessToken, {
					path: '/api',
					maxAge: 15 * 60,
					httponly: true,
				})
				.send({ msg: 'リフレッシュ成功！' });
		} catch (err) {
			return reply.status(500).send({ error: 'トークンを再発行できませんでした。' });
		}
	});

	fastify.post('/api/auth/logout', async (request, reply) => {
		const refreshToken = request.cookies.refreshToken;

		try {
			// リフレッシュトークンはDBからも削除（nullに）
			await pool.query('UPDATE users SET refresh_token=null WHERE refresh_token=?', [
				refreshToken,
			]);

			return reply
				.clearCookie('accessToken', {
					path: '/api',
				})
				.clearCookie('refreshToken', {
					path: '/api',
				})
				.send({ msg: 'ログアウト！' });
		} catch (err) {
			return reply.status(500).send({ error: 'ログアウトが正常に完了しませんでした。' });
		}
	});
}

module.exports = authRoutes;
