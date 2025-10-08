import paramToValue from './lib/param-to-value.js';
import { fetchUserDetails, putUserDetails } from './api/user.js';

const editProfile = async () => {
	const userId = paramToValue('user_id');

	try {
		const { user } = await fetchUserDetails(userId);
		const authorIcon = document.getElementById('author_icon');
		authorIcon.src = DOMPurify.sanitize(user.user_icon);

		const inputUserId = document.getElementById('input_user_id');
		inputUserId.value = user.user_id;

		const inputUserName = document.getElementById('input_user_name');
		inputUserName.value = user.user_name;

		const hiddenId = document.getElementById('hidden_id');
		hiddenId.value = user.id;

		const cancelBtn = document.getElementById('cancel');
		cancelBtn.href = `/user?user_id=${userId}`;

		const editProfileBtn = document.getElementById('commit_change');
		if (!user.editProfileFlg) {
			editProfileBtn.classList.add('d-none');
		}

		const submitProfileChange = document.getElementById('submit_profile_change');
		submitProfileChange.addEventListener('submit', async (event) => {
			event.preventDefault();

			const beforeUserId = userId;
			const afterUserId = DOMPurify.sanitize(inputUserId.value);
			const userName = inputUserName.value;
			const id = hiddenId.value;

			try {
				const msg = await putUserDetails(id, beforeUserId, afterUserId, userName);
				alert(msg);
				window.location.href = `/user?user_id=${afterUserId}`;
			} catch (err) {
				alert(err);
			}
		});
	} catch (err) {
		alert(err);
	}
};

window.addEventListener('DOMContentLoaded', editProfile);
