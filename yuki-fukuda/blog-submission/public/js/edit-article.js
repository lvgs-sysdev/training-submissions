import { API_BASE_URL } from "./config.js";

async function initEditPage() {
  try {
    // 1. ログイン確認
    const response = await fetch(`${API_BASE_URL}/me`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!data.loggedIn) {
      alert("ログインが必要です。");
      window.location.href = "./login.html";
      return;
    }

    // 2. ID取得
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get("id");

    if (!currentId) {
      alert("記事が指定されていません。");
      window.location.href = "./profile.html";
      return;
    }

    // 3. 記事読み込み（ここで画面表示が行われる）
    const article = await loadArticle(currentId);

    if (article.user_id !== data.user.user_id) {
      alert("他の人の記事は編集できません");
      window.location.href = "./edit-profile.html";
      return;
    }

    // 4. イベント登録を実行（ここでボタンが動くようになる）
    setupEventListeners(currentId);
  } catch (err) {
    console.error("初期化エラー:", err);
  }
}

//  データの取得と画面反映
async function loadArticle(id) {
  const response = await fetch(`${API_BASE_URL}/article/${id}`);
  if (!response.ok) throw new Error("記事の取得に失敗しました");

  const article = await response.json();

  // DOMへの反映
  document.getElementById("article-title").innerText = article.article_title;
  document.getElementById("content").innerText = article.content;
  document.getElementById("input-article_title").value = article.article_title;
  document.getElementById("input-content").value = article.content;

  const img = document.getElementById("js-current-image");
  img.src = article.image_path
    ? `${API_BASE_URL}/uploads/${article.image_path}?t=${new Date().getTime()}`
    : "/images/default.png";

  return article;
}

// イベントリスナーを一括指定する

function setupEventListeners(articleId) {
  // ログアウト
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // 編集の切り替え
  const editStartBtn = document.getElementById("btn-edit");
  if (editStartBtn) {
    editStartBtn.addEventListener("click", switchToEditMode);
  }

  // 記事の更新
  const editForm = document.getElementById("js-edit-article-form");
  if (editForm) {
    editForm.addEventListener("submit", (e) =>
      handleArticleUpdate(e, articleId),
    );
  }
}

// ログアウト処理
function handleLogout() {
  alert("ログアウトしました");
  window.location.href = "./login.html";
}

// 表示用のUIを隠し、編集用のフォームを表示する
function switchToEditMode() {
  document
    .querySelectorAll(".js-view")
    .forEach((el) => (el.style.display = "none"));
  document
    .querySelectorAll(".js-edit")
    .forEach((el) => (el.style.display = "inline-block"));
}

// 記事更新の実行
async function handleArticleUpdate(event, articleId) {
  event.preventDefault();

  const editForm = event.currentTarget;
  const formData = new FormData(editForm);

  const title = document.getElementById("input-article_title").value;
  const content = document.getElementById("input-content").value;
  const imageInput = editForm.querySelector('input[type="file"]');

  formData.append("id", articleId);
  formData.append("new_title", title);
  formData.append("new_content", content);

  // 画像ファイルを選択している場合、FormDataに追加する
  if (imageInput && imageInput.files[0]) {
    formData.append("image", imageInput.files[0]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/edit-blog`, {
      method: "POST",
      body: formData, // FormDataをそのまま送る
      credentials: "include",
    });

    if (response.ok) {
      alert("更新しました");
      location.reload();
    } else {
      alert("更新に失敗しました");
    }
  } catch (err) {
    console.error("保存エラー", err);
  }
}

// 実行
initEditPage();
