async function loadArticles() {
  try {
    const response = await fetch("https://localhost:3000/");
    const posts = await response.json();
    const container = document.getElementById("post-container");
    container.innerHTML = "";

    posts.forEach((post) => {
      const article = document.createElement("article");
      const imageSrc = post.image_path
        ? `/uploads/${post.image_path}`
        : `/images/default-thumbnail.png`;

      article.className = "main-container";

      article.innerHTML = `
        <img class="main-container-img" src="${imageSrc}" alt="サムネイル">
        <small>投稿者: ${post.user_id}</small>
        <small class="main-container-date">${new Date(post.updated_at).toLocaleDateString()}</small>
        <h3 class="main-container-title"> ${post.article_title} </h3>
        <p class="main-container-text"> ${post.content}</p>
        <a href="detail.html?id=${post.id}" class="btn-edit">この記事を詳しく読む</a>
        `;
      container.appendChild(article);
    });
  } catch (err) {
    console.error("記事の読み込みに失敗しました", err);
    alert("記事の読み込みに失敗しました");
  }
}

loadArticles();
