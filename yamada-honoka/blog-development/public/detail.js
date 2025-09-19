document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    console.log('Article ID:', articleId);

    const container = document.getElementById('article-detail');

    if (!container) {
        alert('記事の読み込みに失敗しました');
        return;
    }

    if (!articleId) {
        container.innerHTML = '無効な記事IDです';
        return;
    }
    
    try {
        const encodedId = encodeURIComponent(articleId);
        const response = await fetch(`/article/${encodedId}`);

    if (response.status === 404) {
        container.innerHTML = '記事が見つかりませんでした';
        return;
    }

    const article = await response.json();
    console.log(article);

    const date = new Date(article.updated_at);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    console.log(formattedDate);

    document.getElementById('author-name').innerHTML = article.user_id;
    document.getElementById('article-date').innerHTML = formattedDate;
    document.getElementById('article-title').innerHTML = article.article_title;
    document.getElementById('article-content').innerHTML = article.content;

} catch (error) {
    console.error('記事の取得中にエラーが発生しました:', error);
    if(container) {
        container.innerHTML = '記事の読み込みに失敗しました';
    }

    }
});