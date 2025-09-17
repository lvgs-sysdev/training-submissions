import { ordinaryApiClient } from './api-client.js';

export const removeToken = async () => {
	try {
		const response = await ordinaryApiClient.post('/auth/logout', {});
		return response.data.msg;
	} catch (err) {
		if (err.response) {
			throw err.response.data.error;
		}
		throw '接続エラー';
	}
};
