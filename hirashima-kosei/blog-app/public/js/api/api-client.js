import { removeToken } from './auth.js';

// 標準で使用するAPIクライアント
export const ordinaryApiClient = axios.create({
	baseURL: 'http://localhost:5050/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// リフレッシュを行うAPIクライアント
export const authorizedApiClient = {
	get: async (url, params = {}) => {
		try {
			const response = await ordinaryApiClient.get(url, {
				params,
			});
			return response;
		} catch (err) {
			// ステータスコードが401でアクセストークンの検証に失敗している場合は1度リフレッシュ後、再度リクエスト
			if (err.response) {
				if (err.response.status === 401) {
					try {
						await refreshAccessToken();
					} catch (err) {
						throw err;
					}
					try {
						const response = await ordinaryApiClient.get(url, {
							params,
						});
						return response;
					} catch (err) {
						if (err.response) {
							throw err.response.data.error;
						}
						throw '接続エラー';
					}
				}
				throw err.response.data.error;
			}
			throw '接続エラー';
		}
	},

	put: async (url, body = {}) => {
		try {
			const response = await ordinaryApiClient.put(url, body);
			return response;
		} catch (err) {
			if (err.response) {
				if (err.response.status === 401) {
					try {
						await refreshAccessToken();
					} catch (err) {
						throw err;
					}
					try {
						const response = await ordinaryApiClient.put(url, body);
						return response;
					} catch (err) {
						if (err.response) {
							throw err.response.data.error;
						}
						throw '接続エラー';
					}
				}
				throw err.response.data.error;
			}
			throw '接続エラー';
		}
	},
};

// アクセストークンを更新するための関数
export const refreshAccessToken = async () => {
	try {
		await ordinaryApiClient.post('/auth/refresh', {});
		return;
	} catch (err) {
		if (err.response) {
			removeToken();
			throw err.response.data.error;
		}
		removeToken();
		throw '接続エラー';
	}
};
