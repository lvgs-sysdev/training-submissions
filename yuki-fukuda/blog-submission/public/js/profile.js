// profile.js
import { API_BASE_URL } from "./config.js";

let currentId = "";

// --- 1. 設計図：プロフィールを読み込む関数 ---
async function loadProfile() {
  try {
    // currentId が空の場合は中断
    if (!currentId) return;

    const response = await fetch(`${API_BASE_URL}/get-profile/${currentId}`);
    const user = await response.json();

    document.getElementById("display-id").innerText = user.user_id;
    document.getElementById("display-name").innerText = user.user_name;

    document.getElementById("input-id").value = user.user_id;
    document.getElementById("input-name").value = user.user_name;
    console.log("プロフィール読み込み完了");
  } catch (err) {
    console.error("プロフィール表示エラー", err);
  }
}

document.querySelector("#submit-post").addEventListener("click", async (e) => {
  // クリックされたボタン要素を取得する
  const submitBtn = e.currentTarget;
  const title = document.querySelector("#post-title").value;
  const content = document.querySelector("#post-content").value;
  const imageFile = document.querySelector("#js-image-input").files[0];

  if (!title || !content) {
    alert("タイトルと本文を入力してください");
    return;
  }

  try {
    //　処理中にボタンを無効化する
    submitBtn.disabled = true;
    submitBtn.innerText = "投稿中...";
    submitBtn.style.cursor = "not-allowed";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/post-article`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      alert("投稿が完了しました!");
      location.reload();
    } else {
      alert("投稿に失敗しました");
      // 再度ボタンを押せるように戻す
      submitBtn.disabled = false;
      submitBtn.innerText = "投稿する";
      submitBtn.style.cursor = "pointer";
    }
  } catch (err) {
    console.error("エラー", err);
    // 通信エラー時も押せるようにする(次の課題の際にはモジュール化できそうなのでモジュール化する)
    submitBtn.disabled = false;
    submitBtn.innerText = "投稿する";
    submitBtn.style.cursor = "pointer";
  }
});

// --- 2. 設計図：自分の記事を読み込む関数 ---
async function loadArticles() {
  const container = document.getElementById("my-posts-container");

  try {
    const response = await fetch(`${API_BASE_URL}/my-articles`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("記事取得失敗");

    const myPosts = await response.json();

    if (myPosts.length === 0) {
      container.innerHTML = "<p>まだ投稿した記事はありません。</p>";
      return;
    }

    container.innerHTML = "";

    const articlesHtml = myPosts
      .map((post) => {
        const imageSrc = post.image_path
          ? `/uploads/${post.image_path}`
          : "/images/default-thumbnail.png";

        // HTMLの文字列を配列として作成
        return `
    <div class="my-post-card">
      <img src="${imageSrc}" style="width: 320px; height: auto">
      <h3>${post.article_title}</h3>
      <p>${post.content.substring(0, 50)}...</p>
      <div class="actions">
        <a href="edit-article.html?id=${post.id}" class="btn-edit">編集する</a>
      </div>
    </div>
  `;
      })
      .join(""); // 配列を1つの長い文字列に結合

    container.innerHTML = articlesHtml;

    console.log("記事一覧読み込み完了");
  } catch (err) {
    console.error("記事一覧表示エラー", err);
    container.innerHTML = "<p>エラーが発生しました。</p>";
  }
}

// --- 3. 実行：すべてをまとめるメイン関数 ---
async function initProfile() {
  try {
    const meRes = await fetch(`${API_BASE_URL}/me`, {
      credentials: "include",
    });
    const auth = await meRes.json();

    if (auth.loggedIn) {
      currentId = auth.user.user_id;
      console.log("ログイン確認完了:", currentId);

      // 上で定義した関数を呼ぶ
      await loadProfile();
      await loadArticles();
    } else {
      alert("ログインが必要です");
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("初期化エラー", err);
  }
}

initProfile();

// --- 4. 設計図：プロフィールを更新する関数 ---
async function updateProfile() {
  const newId = document.getElementById("input-id").value;
  const newName = document.getElementById("input-name").value;

  // サーバーが期待している形式 (JSON) に合わせる
  const updateData = {
    old_id: currentId, // initProfileで取得済みの現在のID
    new_id: newId,
    new_name: newName,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("プロフィールを更新しました！");
      location.reload(); // 画面を更新して新しい情報を反映
    } else {
      alert(result.error || "更新に失敗しました。");
    }
  } catch (err) {
    console.error("更新エラー", err);
    alert("通信エラーが発生しました");
  }
}

// --- 5. イベントリスナー（編集ボタンなど） ---
document.getElementById("btn-edit").addEventListener("click", () => {
  document.getElementById("display-id").style.display = "none";
  document.getElementById("display-name").style.display = "none";
  document.getElementById("input-id").style.display = "inline";
  document.getElementById("input-name").style.display = "inline";
  document.getElementById("btn-edit").style.display = "none";
  document.getElementById("btn-save").style.display = "inline";
});

document.getElementById("btn-save").addEventListener("click", async () => {
  await updateProfile();
});
