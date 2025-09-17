import { fetchLoginUser } from './api/user.js';
import { removeToken } from './api/auth.js';

async function headerProfile() {
	const loginStatus = document.getElementById('login_status');

	let innerStatus;

	try {
		const { msg, user } = await fetchLoginUser();

		if (msg === '非ログインユーザー') {
			innerStatus = `
				<a href="/login" class="header-login">Login</a>
				<a href="/register" class="header-get-started" role="button">Get started</a>
			`;
		} else {
			innerStatus = `
				<div class="position-relative">
					<img src=${user.user_icon} alt="Author Icon" class="header-user-icon" role="button" id="popup_button"/>
					<div class="popup-container bg-white d-none" id="popup_container">
						<div class="popup-content">
							<ul class="list-unstyled">
								<li>
									<a href="" id="logout">Logout</a>
								</li>
								<li>
									<a href="/user?user_id=${user.user_id}">Profile</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			`;
		}
		loginStatus.innerHTML = DOMPurify.sanitize(innerStatus);

		if (msg === 'ログインユーザー') {
			const popupBtn = document.getElementById('popup_button');
			popupBtn.addEventListener('click', () => {
				const popupContainer = document.getElementById('popup_container');
				popupContainer.classList.contains('d-none')
					? popupContainer.classList.remove('d-none')
					: popupContainer.classList.add('d-none');
			});

			const logout = document.getElementById('logout');
			logout.addEventListener('click', async () => {
				try {
					const msg = await removeToken();
					alert(msg);
				} catch (err) {
					alert(err);
				}
			});
		}
	} catch (err) {
		alert(err);
	}
}

window.addEventListener('DOMContentLoaded', headerProfile);
