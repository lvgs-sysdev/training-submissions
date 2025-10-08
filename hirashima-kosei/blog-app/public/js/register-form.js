import { apiClient } from './api/api-client.js';

const registerForm = document.getElementById('register_form');

registerForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const userId = document.getElementById('input_id').value;
	const userName = document.getElementById('input_username').value;
	const password = document.getElementById('input_password').value;

	try {
		const response = await apiClient.post('/auth/register', { userId, userName, password });
		alert(response.data.msg);
		window.location.href = '/login';
	} catch (err) {
		alert(err);
	}
});
