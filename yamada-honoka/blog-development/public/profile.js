const messageDiv = document.getElementById('message');
const userIdInput = document.getElementById('user_id');
const userNameInput = document.getElementById('user_name');
const profileForm = document.getElementById('profile-form');

async function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        const data = await response.json();

        if (response.ok) {
            userIdInput.value = data.user.user_id;
            userNameInput.value = data.user.user_name;
        } else {
            messageDiv.textContent = data.message;
        }        
        } catch (error) {
            console.error('プロフィール取得エラー:', error);
            messageDiv.textContent = 'プロフィールの取得に失敗しました';
        }
    }

    // ユーザーID/ユーザー名更新
    profileForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const token = localStorage.getItem('token');
            const userName = userNameInput.value;
            const userId = userIdInput.value;

            try {
                const response = await fetch('/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ user_name: userName, user_id: userId }) // user_idとuser_name両方をJSONに含めて
                });

                const data = await response.json();

                messageDiv.textContent = data.message;
                messageDiv.style.color = response.ok ? 'green' : 'red';
            } catch (error) {
                messageDiv.textContent = 'プロフィールの更新に失敗しました';
                messageDiv.style.color = 'red';
                console.error('プロフィール更新エラー:', error);
            }
        });

async function fetchMyArticles() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/my-articles', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const articles = await response.json();
        const container = document.getElementById('my-article-container');

        articles.forEach(article => {
            const articleDiv = document.createElement('div');
            const editLink = `/blog.html?id=${article.id}`;

            articleDiv.innerHTML = `
                <p>
                    <a href="${editLink}">${article.article_title}</a>
                </p>
                <small>${new Date(article.updated_at).toLocaleDateString()}</small>
            `;
            container.appendChild(articleDiv);
        });
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    fetchMyArticles();
});