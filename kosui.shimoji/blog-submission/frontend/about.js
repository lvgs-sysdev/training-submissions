async function loadArticleDetail() {

    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        console.error("記事IDが見つかりません");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/articles/${articleId}`);
        const article = await response.json();

        document.getElementById('article-title').textContent = article.article_title;
        document.getElementById('article-content').textContent = article.content;
        document.getElementById('article-date').textContent = article.created_at;

    } catch (error) {
        console.error("データの取得に失敗しました:", error);
    }
}
    async function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error("URLにIDが含まれていません。");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/articles/${id}`);
        const article = await response.json();

        // 2. タイトルの反映
        const titleElem = document.getElementById('article-title');
        if (titleElem) {
            titleElem.textContent = article.article_title;
        }

        const contentElem = document.getElementById('article-content');
        if (contentElem) {
            contentElem.textContent = article.content;
        }

        const dateElem = document.getElementById('article-date');
        if (dateElem) {
            const rawDate = String(article.created_at);
            
            if (rawDate.length === 8) {
                const y = rawDate.substring(0, 4);
                const m = rawDate.substring(4, 6);
                const d = rawDate.substring(6, 8);
                dateElem.textContent = `${y}/${m}/${d}`;
            } else {
                const date = new Date(Number(rawDate) * 1000);
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                const d = date.getDate();
                dateElem.textContent = `${y}/${m}/${d}`;
            }
        }

    } catch (error) {
        console.error("データの取得、または反映に失敗しました:", error);
    }
}

// 最後に1回だけ実行
loadArticle();