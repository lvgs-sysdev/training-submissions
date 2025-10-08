import { apiClient } from './api/api-client.js';

const loginForm = document?.getElementById('login_form');

loginForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const userId = document.getElementById('input_id').value;
	const password = document.getElementById('input_password').value;

	try {
		const response = await apiClient.post('/auth/login', { userId, password });
		alert(response.data.msg);
		window.location.href = '/';
	} catch (err) {
		alert(err);
	}
});
