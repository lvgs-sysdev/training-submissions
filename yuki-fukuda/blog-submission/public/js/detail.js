async function fetchDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  if (!articleId) {
    alert("記事IDが指定されていません");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(
      `https://localhost:3000/article-detail/${articleId}`,
    );
    if (!response.ok) throw new Error("記事の取得に失敗");
    const article = await response.json();

    document.getElementById("article_title").innerText = article.article_title;
    document.getElementById("user_name").innerText = article.user_name;
    document.getElementById("detail_date").innerText = new Date(
      article.updated_at,
    ).toLocaleDateString();
    document.getElementById("content").innerText = article.content;

    const imgElement = document.getElementById("detail-image");
    if (article.image_path) {
      imgElement.src = `/uploads/${article.image_path}`;
      imgElement.style.display = "block";
    } else {
      imgElement.src = "/images/default-thumbnail.png";
    }
  } catch (err) {
    console.error("詳細読み込みエラー：", err);
    document.body.innerHTML = "<h1>記事が見つかりませんでした</h1>";
  }
}

fetchDetail();
