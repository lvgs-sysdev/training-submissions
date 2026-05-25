// index.js

// 画面が読み込まれたら実行する関数
async function displayArticles() {
    try {
        // 1. APIから記事一覧を取得（Fastifyのサーバーを起動しておくこと！）
        const response = await fetch('http://localhost:3000/articles');
        const articles = await response.json();

        const container = document.getElementById('article-container');

        // 3. 今ある「読み込み中...」などの初期表示をクリアする
        container.innerHTML = '';

        // 4. 記事の数だけ、HTMLのカードを生成する
        articles.forEach(article => {
            // 新しい article 要素を作成
            const articleCard = document.createElement('article');
            articleCard.className = 'article-contents';

            // HTMLの構造を再現
            articleCard.innerHTML = `
                <a href="about.html?id=${article.id}">
                    <figure class="article-image">
                        <img src="../images/P1/left1.png" alt="Article image">
                    </figure>
                    <div class="article-info">
                        <div class="post-meta">
                            <span class="main-category">Travel</span>
                            <time class="main-category-date">${new Date(article.created_at).toLocaleDateString('ja-JP')}
                            </time>
                        </div>
                        <h2>${article.title}</h2>
                        <span>${article.content.substring(0, 50)}...</span>
                    </div>
                </a>
            `;

            // 親要素（main）に追加する
            container.appendChild(articleCard);
        });

    } 
    catch (error) {
        console.error("データの取得に失敗しました:", error);
        document.getElementById('article-container').innerHTML = 
            '<p>データの読み込みに失敗しました。サーバーが動いているか確認してください。</p>';
    }
}

// 最後にこの関数を呼び出す！
displayArticles();