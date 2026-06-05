window.addEventListener('DOMContentLoaded', () => {
    // ログイン状態の確認とヘッダー制御
    const cookies = document.cookie;
    const hasCookie = cookies.includes('session_user=');
    const navbarNav = document.querySelector('.header .navbar');
    let currentUserId = null; 

    if (hasCookie && navbarNav) {
        currentUserId = cookies.split('session_user=')[1].split(";")[0];
        
        // マイページへのリンクを持つヘッダーUIを生成
        navbarNav.innerHTML = `
            <div class="user-logged-in" style="display: flex; align-items: center; gap: 15px;">
                <a href="user.html?userId=${currentUserId}" id="header-user-link" style="text-decoration: none; font-weight: 500; color: #333; font-size: 16px; transition: color 0.2s;">
                    👤 読み込み中...
                </a>
                <button id="logout-btn" onclick="logout()" style="background-color: #FF553C; color: white; padding: 10px 20px; font-size: 14px; cursor: pointer; border: none; font-weight: 300;">Logout</button>
            </div>
        `;

        // ユーザー名の非同期取得と反映
        fetch(`http://localhost:3000/user?userId=${currentUserId}`)
            .then(res => res.json())
            .then(data => {
                const userLink = document.getElementById('header-user-link');
                if (userLink && data.user) {
                    userLink.innerText = `👤 ${data.user.user_name} さん`;
                }
            })
            .catch(err => console.error('Header user name fetch error:', err));

    } else if (navbarNav) {
        navbarNav.innerHTML = `
            <ul class="navbar-list">
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html" class="btn-primary">Get started</a></li>
            </ul>
        `;
    }

    // URLパラメータから記事IDを取得（デフォルト値: 7）
    const urlParams = new URLSearchParams(window.location.search);
    let articleId = urlParams.get('id') || '7';

    // 記事詳細データの取得と反映
    fetch(`http://localhost:3000/detail?id=${articleId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch article details');
            return response.json();
        })
        .then(article => {
            // タイトル・作成者名の反映
            document.querySelector('.article-title-wrapper .article-title').innerText = article.article_title;
            document.querySelector('.author-profile-detail .profile-name').innerText = article.user_name;
            
            // 筆者アイコン画像の反映（未登録時はデフォルト画像）
            const avatarName = article.profile_image || 'default-icon.png';
            const avatarImg = document.getElementById('detail-avatar') || document.querySelector('.profile-img img');
            if (avatarImg) {
                avatarImg.src = `http://localhost:3000/public/uploads/${avatarName}`;
            }

            // 記事メイン画像と本文の反映
            const articleContentDiv = document.querySelector('.article-content');
            if (articleContentDiv) {
                const mainImgHtml = article.article_image 
                    ? `<div class="article-main-img-wrapper" style="margin-bottom: 20px;">
                            <figure class="article-main-img">
                                <img src="http://localhost:3000/public/uploads/${article.article_image}" alt="article-img">
                            </figure>
                            <p class="article-main-img-description" style="margin-top: 8px;">Featured Image</p>
                        </div>`
                    : '';

                articleContentDiv.innerHTML = `
                    ${mainImgHtml}
                    <p class="article-text" style="white-space: pre-wrap; margin-bottom: 30px;">
                        ${article.content}
                    </p>
                `;
            }
            
            // 投稿日時のフォーマット変換と反映
            const date = new Date(article.updated_at);
            const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); 
            document.querySelector('.author-profile-detail time').innerText = formattedDate;

            // 作成者本人である場合のみ編集ボタンを表示
            const articleAuthorId = article.author_id;
            if (currentUserId && currentUserId === articleAuthorId) {
                const editBtnContainer = document.getElementById('edit-button-container');
                if (editBtnContainer) editBtnContainer.style.display = 'block'; 

                const editBtn = document.getElementById('btn-edit-goto');
                if (editBtn) editBtn.href = `edit.html?id=${articleId}`; 
            }
        })
        .catch(error => console.error('Article fetch error:', error));
});

// ログアウト処理
window.logout = () => {
    document.cookie = 'session_user=; path=/; max-age=0';
    alert('ログアウトしました');
    window.location.reload(); 
};