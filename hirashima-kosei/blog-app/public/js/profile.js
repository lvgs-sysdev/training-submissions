import { fetchUserItems } from './api/user.js';
import paramToValue from './lib/param-to-value.js';

const userProfile = async () => {
	const userId = paramToValue('user_id');

	try {
		const { user } = await fetchUserItems(userId);

		const userIcon = document.getElementById('author_icon');
		userIcon.src = DOMPurify.sanitize(user.user_icon);

		const profileUserId = document.getElementById('profile_user_id');
		profileUserId.textContent = user.user_id;

		const profileUserName = document.getElementById('profile_user_name');
		profileUserName.textContent = user.user_name;

		const editProfileBtn = document.getElementById('edit_profile');
		editProfileBtn.addEventListener('click', () => {
			window.location.href = `/editUser?user_id=${user.user_id}`;
		});
		if (!user.editProfileFlg) {
			editProfileBtn.classList.add('d-none'); // 自分以外のプロフィール画面では編集を不可に
		}
	} catch (err) {
		alert(err);
	}
};

window.addEventListener('DOMContentLoaded', userProfile);
