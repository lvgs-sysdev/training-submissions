import { apiClient } from './api-client.js';
import { refreshAccessToken } from './auth.js';

export const fetchLoginUser = async () => {
	try {
		const response = await apiClient.get('/user/loginUser');
		return response;
	} catch (err) {
		throw err;
	}
};

export const fetchUserDetails = async (userId) => {
	try {
		const response = await apiClient.get('/user/profile', { params: { userId } });

		const user = response.data.user;

		return { user };
	} catch (err) {
		throw err;
	}
};

export const putUserDetails = async (id, beforeUserId, afterUserId, userName) => {
	try {
		const response = await apiClient.put('/user/editProfile', {
			id,
			beforeUserId,
			afterUserId,
			userName,
		});
		// ユーザーIDが変更の場合、アクセストークンをリフレッシュ
		if (beforeUserId !== afterUserId) {
			await refreshAccessToken();
		}
		return response.data.msg;
	} catch (err) {
		throw err;
	}
};
