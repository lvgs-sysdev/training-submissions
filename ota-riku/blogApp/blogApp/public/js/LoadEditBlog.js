document.addEventListener("DOMContentLoaded", async () => {
  const url = new URL(window.location.href);
  const path = url.pathname.split("/");
  const id = path[path.length - 1];

  const titleInputElem = document.getElementById("title-input");
  const contextInputElem = document.getElementById("context-input");

  try {
    const response = await fetch("/api/article-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleId: id,
      }),
    });
    if (response.ok) {
      const articleInfo = await response.json();
      console.log(articleInfo);
      titleInputElem.value = articleInfo.article_title;
      contextInputElem.textContent = articleInfo.content;
    }
  } catch (e) {
    console.log(e);
  }
});
