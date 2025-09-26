import { apiClient } from './api-client.js';

export const removeToken = async () => {
	try {
		const response = await apiClient.post('/auth/logout', {});
		return response.data.msg;
	} catch (err) {
		if (err.response) {
			throw err.response.data.error;
		}
		throw '接続エラー';
	}
};

// アクセストークンを更新するための関数
export const refreshAccessToken = async () => {
	try {
		await apiClient.post('/auth/refresh', {});
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
