async function loadArticles() {
    try{
    const response = await fetch('http://localhost:3000/');
    const posts = await response.json();

    const container = document.getElementById('post-container');
    container.innerHTML = '';

    posts.forEach((post) => {
        const article = document.createElement('article');
        article.className = 'post-item';

        article.innerHTML = `
        <h3> ${post.article_title} </h3>
        <p> ${post.content}</p>
        <small>投稿日:${new Date(post.updated_at).toLocaleDateString()}</small>
        `;
        container.appendChild(article);
    });
    } catch (err) {
        console.error('記事の読み込みに失敗しました',err);
        alert('記事の読み込みに失敗しました');
    }
};

loadArticles();
