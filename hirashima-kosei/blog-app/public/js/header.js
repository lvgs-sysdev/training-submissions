import { fetchLoginUser } from './api/user.js';
import { removeToken } from './api/auth.js';

async function headerProfile() {
	const loginStatus = document.getElementById('login_status');

	try {
		const response = await fetchLoginUser();
		const user = response.data.user;
		if (response.status === 204) {
			loginStatus.innerHTML = `
				<a href="/login" class="header-login">Login</a>
				<a href="/register" class="header-get-started" role="button">Get started</a>
			`;
		} else if (response.status === 200) {
			const loginUserIcon = `
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
			loginStatus.innerHTML = DOMPurify.sanitize(loginUserIcon);

			const popupBtn = document.getElementById('popup_button');
			popupBtn.addEventListener('click', () => {
				const popupContainer = document.getElementById('popup_container');
				popupContainer.classList.contains('d-none')
					? popupContainer.classList.remove('d-none')
					: popupContainer.classList.add('d-none');
			});

			const logout = document.getElementById('logout');
			logout.addEventListener('click', async (event) => {
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
