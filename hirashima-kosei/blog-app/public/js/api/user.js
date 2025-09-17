import { authorizedApiClient, refreshAccessToken } from './api-client.js';

export const fetchLoginUser = async () => {
	try {
		const response = await authorizedApiClient.get('/user/loginUser');

		const msg = response.data.msg;
		const user = response.data.user;

		return { msg, user };
	} catch (err) {
		throw err;
	}
};

export const fetchUserItems = async (userId) => {
	try {
		const response = await authorizedApiClient.get('/user/profile', { userId });

		const user = response.data.user;

		return { user };
	} catch (err) {
		throw err;
	}
};

export const putUserItems = async (id, beforeUserId, afterUserId, userName) => {
	try {
		const response = await authorizedApiClient.put('/user/editProfile', {
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
