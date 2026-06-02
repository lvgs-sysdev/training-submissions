async function loadArticle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    console.error("URLにIDが含まれていません。");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/articles/${id}`);
    const article = await response.json();

    // 2. タイトルの反映
    const titleElem = document.getElementById("article-title");
    if (titleElem) {
      titleElem.textContent = article.article_title;
    }

    const contentElem = document.getElementById("article-content");
    if (contentElem) {
      contentElem.textContent = article.content;
    }

    const dateElem = document.getElementById("article-date");
    if (dateElem) {
      const rawDate = String(article.created_at);

      if (rawDate.length === 8) {
        const year = rawDate.substring(0, 4);
        const month = rawDate.substring(4, 6);
        const day = rawDate.substring(6, 8);
        dateElem.textContent = `${year}/${month}/${day}`;
      } else {
        const date = new Date(Number(rawDate) * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        dateElem.textContent = `${year}/${month}/${day}`;
      }
    }

    const authorElem = document.getElementById("article-author");
    if (authorElem) {
      authorElem.textContent = article.user_name;
    }
  } catch (error) {
    console.error("データの取得、または反映に失敗しました:", error);
  }
}

// 最後に1回だけ実行
loadArticle();
