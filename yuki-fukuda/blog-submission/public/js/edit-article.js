// 全ての処理を一つの非同期関数にまとめる
async function initEditPage() {
    try {
        // 1. ログイン確認 
        const response = await fetch('http://localhost:3000/me');
        const data = await response.json();

        if (!data.loggedIn) {
            alert("このページを表示するにはログインが必要です。");
            window.location.href = './login.html';
            return; // ログインしていない場合はここで終了
        }

        // 2. URLから記事IDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const currentId = urlParams.get('id');

        if (!currentId) {
            alert("記事が指定されておりません。マイページに戻ります。");
            window.location.href = './profile.html'; 
            return;
        }

        // 3. 記事データを読み込む
        await loadArticle(currentId);

        // 4. イベントリスナーを設定する
        setupEventListeners(currentId);

    } catch (err) {
        console.error("初期化エラー:", err);
    }
}

// 記事データを取得して画面に表示する関数
async function loadArticle(id) {
    try {
        const response = await fetch(`http://localhost:3000/article/${id}`);
        if (!response.ok) throw new Error("記事の取得に失敗しました");
        
        const article = await response.json();

        // 画面の各要素にデータを流し込む
        document.getElementById('article-title').innerText = article.article_title;
        document.getElementById('content').innerText = article.content;
        document.getElementById('input-article_title').value = article.article_title;
        document.getElementById('input-content').value = article.content;
        const img = document.getElementById('js-current-image');
        img.src = article.image_path 
            ? `/uploads/${article.image_path}?t=${new Date().getTime()}`
            : '/images/default.png';

    } catch (err) {
        console.error("表示エラー", err);
    }
}

// ボタンのクリックイベントなどをまとめる関数
function setupEventListeners(id) {
    // ログアウトボタン
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            alert("ログアウトしました");
            window.location.href = './login.html';
        });
    }

    // 編集ボタン
    document.getElementById('btn-edit').addEventListener('click', () => {
        document.getElementById('article-title').style.display = 'none';
        document.getElementById('content').style.display = 'none';
        document.getElementById('input-article_title').style.display = 'inline';
        document.getElementById('input-content').style.display = 'inline';
        document.getElementById('btn-edit').style.display = 'none';
        document.getElementById('btn-save').style.display = 'inline';
    });

    // 保存ボタン
    document.getElementById('btn-save').addEventListener('click', async () => {
        const newTitle = document.getElementById('input-article_title').value;
        const newContent = document.getElementById('input-content').value;
        const imageFile = document.getElementById('js-image-input').files[0];

        const formData = new FormData()
        formData.append('id', id);
        formData.append('new_title', newTitle);
        formData.append('new_content', newContent);

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch('http://localhost:3000/edit-blog', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                alert("更新しました");
                location.reload();
            }
        } catch (err) {
            console.error("保存エラー", err);
        }
    });
}

// 最後にスイッチを押して実行！
initEditPage();
