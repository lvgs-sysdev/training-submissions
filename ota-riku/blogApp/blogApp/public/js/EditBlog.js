import { errorCodes } from "fastify";

// 記事表示処理
document.addEventListener("DOMContentLoaded", async () => {
  const url = new URL(window.location.href);
  const path = url.pathname.split("/");
  const id = path[path.length - 1];

  const titleInputElem = document.getElementById("title-input");
  const contextInputElem = document.getElementById("context-input");

  // fetchメソッドのタイムアウト設定
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 10000);

  try {
    const response = await fetch("/api/article-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleId: id,
      }),
      signal: abortController.signal,
    });

    // レスポンスが返ってきたらタイマーをリセット
    clearTimeout(timeout);

    if (response.ok) {
      const articleInfo = await response.json();
      console.log(articleInfo);
      titleInputElem.value = articleInfo.article_title;
      contextInputElem.textContent = articleInfo.content;
    } else {
      const error = new Error(
        `HTTP Error is occored.${response.status} ${response.statusText}`
      );
      error.statusCode = response.status;
      error.statusText = response.statusText;
      throw error;
    }
  } catch (e) {
    console.log(e);
    window.location.href = `/error/${e.statusCode}`;
  }
});

// 編集完了ボタン処理
const editblogForm = document.getElementById("edit-blog-form");

editblogForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // articleIdの取得
  const url = new URL(window.location.href);
  const path = url.pathname.split("/");
  const articleId = path[path.length - 1];

  // articleTitleの取得
  const articleTitle = document.getElementById("title-input").value;

  // articleContextの取得
  const articleContext = document.getElementById("context-input").value;

  try {
    const response = await fetch("/editBlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleId: articleId,
        title: articleTitle,
        context: articleContext,
      }),
    });

    if (response.ok) {
      console.log("Edit Completed.");
      window.location.href = "/home";
    } else {
      const error = new Error(
        `HTTP Error is occored.${response.status} ${response.statusText}`
      );
      error.statusCode = response.status;
      error.statusText = response.statusText;
      throw error;
    }
  } catch (e) {
    console.log(e);
    window.location.href = `/error/${e.statusCode}`;
  }
});
