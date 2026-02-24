// profile.js

let currentId = "";

// --- 1. 設計図：プロフィールを読み込む関数 ---
async function loadProfile() {
    try {
        // currentId が空の場合は中断
        if (!currentId) return;

        const response = await fetch(`http://localhost:3000/get-profile/${currentId}`);
        const user = await response.json();

        document.getElementById('display-id').innerText = user.user_id;
        document.getElementById('display-name').innerText = user.user_name;

        document.getElementById('input-id').value = user.user_id;
        document.getElementById('input-name').value = user.user_name;
        console.log("プロフィール読み込み完了");
    } catch (err) {
        console.error("プロフィール表示エラー", err);
    }
}

document.querySelector('#submit-post').addEventListener('click' , async () => {
    const title = document.querySelector('#post-title').value
    const content = document.querySelector('#post-content').value;
    const imageFile = document.querySelector('#js-image-input').files[0];

    if(!title || !content) {
        alert("タイトルと本文を入力してください")
        return;
    }

    try{
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
            formData.append('image' , imageFile);
        }

        const response = await fetch('http://localhost:3000/post-article', {
            method: "POST",
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            alert("投稿が完了しました!");
            location.reload();
        } else {
            alert("投稿に失敗しました");
        }
    } catch (err) {
        console.error("エラー", err);
    }
});

// --- 2. 設計図：自分の記事を読み込む関数 ---
async function loadArticles() {
    const container = document.getElementById('my-posts-container');

    try {
        const response = await fetch('http://localhost:3000/my-articles', {
            credentials: 'include'
        });

        if (!response.ok) throw new Error("記事取得失敗");

        const myPosts = await response.json();

        if (myPosts.length === 0) {
            container.innerHTML = '<p>まだ投稿した記事はありません。</p>';
            return;
        };

        container.innerHTML = ''; 

        myPosts.forEach(post => {

            // イメージ画像
            const imageSrc = post.image_path
                ? `/uploads/${post.image_path}`
                : '/images/default-thumbnail.png'

            const card = document.createElement('div');
            card.className = 'my-post-card'; 
            card.innerHTML = `
                <img src="${imageSrc}" style="width: 320px; height: auto">
                <h3>${post.article_title}</h3>
                <p>${post.content.substring(0,50)}...</p>
                <div class="actions">
                    <a href="edit-article.html?id=${post.id}" class="btn-edit">編集する</a>
                </div>
            `;
            container.appendChild(card); 
        });
        console.log("記事一覧読み込み完了");
    } catch (err) {
        console.error("記事一覧表示エラー", err);
        container.innerHTML = '<p>エラーが発生しました。</p>';
    }
}

// --- 3. 実行：すべてをまとめるメイン関数 ---
async function initProfile() {
    try {
        const meRes = await fetch('http://localhost:3000/me', { credentials: 'include' });
        const auth = await meRes.json();
        
        if (auth.loggedIn) {
            currentId = auth.user.user_id;
            console.log("ログイン確認完了:", currentId);
            
            // 上で定義した関数を呼ぶ
            await loadProfile();  
            await loadArticles(); 
        } else {
            alert("ログインが必要です");
            window.location.href = 'login.html';
        }
    } catch (err) {
        console.error("初期化エラー", err);
    }
}

initProfile();

// --- 5. イベントリスナー（編集ボタンなど） ---
document.getElementById('btn-edit').addEventListener('click', () => {
    document.getElementById('display-id').style.display = 'none';
    document.getElementById('display-name').style.display = 'none';
    document.getElementById('input-id').style.display = 'inline';
    document.getElementById('input-name').style.display = 'inline';
    document.getElementById('btn-edit').style.display = 'none';
    document.getElementById('btn-save').style.display = 'inline';
});

