document.addEventListener('DOMContentLoaded', () => {
    // ログイン状態の確認とヘッダー制御
    const cookies = document.cookie;
    const hasCookie = cookies.includes('session_user=');
    const navbarNav = document.querySelector('.header .navbar');

    const currentUserId = hasCookie ? cookies.split('session_user=')[1].split(";")[0] : '';
    
    if (hasCookie && navbarNav) {
        navbarNav.innerHTML = `
            <div class="user-logged-in" style="display: flex; align-items: center; gap: 15px;">
                <a href="user.html?userId=${currentUserId}" id="header-user-link" style="text-decoration: none; font-weight: 500; color: #333; font-size: 16px; transition: color 0.2s;">
                    👤 読み込み中...
                </a>
                <button id="logout-btn" onclick="logout()" style="background-color: #FF553C; color: white; padding: 10px 20px; font-size: 14px; cursor: pointer; border: none; font-weight: 300;">Logout</button>
            </div>
        `;

        fetch(`http://localhost:3000/user?userId=${currentUserId}`)
            .then(res => res.json())
            .then(data => {
                const userLink = document.getElementById('header-user-link');
                if (userLink && data.user) {
                    userLink.innerText = `👤 ${data.user.user_name} さん`;
                }
            })
            .catch(err => console.error('Header user name fetch error:', err));
    }

    // URLパラメータから編集対象の記事IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        alert('記事の番号が確認できませんでした。トップページに戻ります。');
        window.location.href = 'index.html';
        return;
    }

    // DOM要素の取得
    const titleInput = document.getElementById('article-title');
    const contentInput = document.getElementById('article-content');
    const editForm = document.getElementById('edit-form');

    // 編集対象記事の既存データを取得
    fetch(`http://localhost:3000/detail?id=${articleId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch article data');
            return response.json(); 
        })
        .then(article => {
            // 編集権限（作成者本人か）のセキュリティチェック
            const articleAuthor = article.author_id;

            if (currentUserId !== articleAuthor) {
                alert('🔒 この記事の編集権限がありません。');
                window.location.href = 'index.html'; 
                return; 
            }

            // フォーム入力欄への初期値マッピング
            titleInput.value = article.article_title;
            contentInput.value = article.content; 
        })
        .catch(error => {
            console.error('Data load error:', error);
            alert('記事のデータを読み込めませんでした。');
        });

    // 変更保存フォームのイベントハンドリング
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedData = {
            id: articleId,
            article_title: titleInput.value,
            content: contentInput.value
        };

        // 記事更新APIへのPUTリクエスト送信
        fetch('http://localhost:3000/article/update', {
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Update failed');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('✨記事の修正が完了しました！');
                window.location.href = 'index.html';
            } else {
                alert('エラー：' + data.message);
            }
        })
        .catch(error => console.error('Submit error:', error));
    });
});

// ログアウト処理
window.logout = () => {
    document.cookie = 'session_user=; path=/; max-age=0';
    alert('ログアウトしました');
    window.location.reload(); 
};