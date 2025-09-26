import { refreshAccessToken } from './auth.js';

// 標準で使用するAPIクライアント
export const apiClient = axios.create({
	baseURL: 'http://localhost:5050/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.response.use(
	// 成功時の処理（関数）
	(response) => response,
	// 失敗時の処理
	async (error) => {
		const originalRequest = error.config;
		if (error.response) {
			if (error.response.status === 401) {
				try {
					await refreshAccessToken();
					// 失敗したリクエスト内容を再度リクエスト
					return apiClient(originalRequest);
				} catch (error) {
					if (error.response) {
						throw error.response.data.error;
					}
					throw '接続エラー';
				}
			}
			throw error.response.data.error;
		}
		throw '接続エラー';
	}
);
