import { ordinaryApiClient } from './api/api-client.js';

const authForm = document.getElementById('auth_form');
authForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const userId = document.getElementById('input_id').value;
	const password = document.getElementById('input_password').value;

	const payload = { userId, password };

	// ユーザー名がある場合（＝登録）
	if (document.getElementById('input_username')) {
		const userName = document.getElementById('input_username').value;
		payload.userName = userName;

		try {
			const response = await ordinaryApiClient.post('/auth/register', payload);
			alert(response.data.msg);
			window.location.href = '/login';
		} catch (err) {
			if (err.response) {
				alert(err.response.data.error);
			} else {
				alert('接続エラー');
			}
		}
	} else {
		try {
			const response = await ordinaryApiClient.post('/auth/login', payload);
			alert(response.data.msg);
			window.location.href = '/';
		} catch (err) {
			if (err.response) {
				if (err.response.status === 401) {
					alert(err.response.data.error);
				} else {
					alert(err.response.data.error);
				}
			} else {
				alert('接続エラー');
			}
		}
	}
});
