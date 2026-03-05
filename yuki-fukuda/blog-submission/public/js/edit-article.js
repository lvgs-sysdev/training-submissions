import { API_BASE_URL } from "./config.js";

// 全ての処理を一つの非同期関数にまとめる
async function initEditPage() {
  try {
    // 1. ログイン確認
    const response = await fetch(`${API_BASE_URL}/me`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!data.loggedIn) {
      alert("このページを表示するにはログインが必要です。");
      window.location.href = "./login.html";
      return; // ログインしていない場合はここで終了
    }

    // 2. URLから記事IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get("id");

    if (!currentId) {
      alert("記事が指定されておりません。マイページに戻ります。");
      window.location.href = "./profile.html";
      return;
    }

    // 3. 記事データを読み込む
    const article = await loadArticle(currentId);

    if (article.user_id !== data.user.user_id) {
      alert("他の人の記事は編集できません");
      window.location.href = "./edit-profile.html";
      return;
    }

    // 4. イベントリスナーを設定する
    setupEventListeners(currentId);
  } catch (err) {
    console.error("初期化エラー:", err);
  }
}

// 記事データを取得して画面に表示する関数
async function loadArticle(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/article/${id}`);
    if (!response.ok) throw new Error("記事の取得に失敗しました");

    const article = await response.json();

    // 画面の各要素にデータを流し込む
    document.getElementById("article-title").innerText = article.article_title;
    document.getElementById("content").innerText = article.content;
    document.getElementById("input-article_title").value =
      article.article_title;
    document.getElementById("input-content").value = article.content;
    const img = document.getElementById("js-current-image");
    img.src = article.image_path
      ? `${API_BASE_URL}/uploads/${article.image_path}?t=${new Date().getTime()}`
      : "/images/default.png";

    return article;
  } catch (err) {
    console.error("表示エラー", err);
  }
}

// ボタンのクリックイベントなどをまとめる関数
function setupEventListeners(id) {
  // ログアウトボタン
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("ログアウトしました");
      window.location.href = "./login.html";
    });
  }

  // 編集ボタン
  document.getElementById("btn-edit").addEventListener("click", () => {
    document.querySelectorAll(".js-view").forEach((el) => {
      el.style.display = "none";
    });

    document.querySelectorAll(".js-edit").forEach((el) => {
      el.style.display = "inline-block";
    });
  });

  const editForm = document.getElementById("js-edit-article-form");
  if (editForm) {
    editForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // リロード防止

      const formData = new FormData(editForm);
      formData.append("id", id); // URLから取ったIDを追加

      try {
        const response = await fetch(`${API_BASE_URL}/edit-blog`, {
          method: "POST",
          body: formData,
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
    });
  }
}

initEditPage();
