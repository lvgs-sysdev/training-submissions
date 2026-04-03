import { setupPostForm } from "./post.js";
export const initTimeline = async (containerId) => {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    try {
        //timeline.htmlの読み込み
        const response = await fetch("/feed/timeline.html");
        container.innerHTML = await response.text();
        // 2. DOM配置後のイベントセットアップ
        setupPostForm(); // 投稿機能の有効化
        setupNavigation(); // ナビゲーション（ログアウト等）の有効化
        await refreshTimeline();
    }
    catch (error) {
        console.error("タイムライン初期化エラー：", error);
        container.innerHTML = "<p>読み込みに失敗しました🐾</p>";
    }
};
export const setupNavigation = () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("token");
            location.reload();
        };
    }
    // 2. マイページボタン（これを目印の id="to-mypage" に紐づける）
    const mypageBtn = document.getElementById("to-mypage");
    console.log("マイページボタン確認:", mypageBtn); // 💡 これが null ならボタンが見つかっていない
    if (mypageBtn) {
        mypageBtn.onclick = async (e) => {
            e.preventDefault(); // 💡 念のためデフォルト動作を防止
            console.log("マイページボタンが押されました！");
            try {
                const { initMypage } = await import("../mypage/mypage.js");
                initMypage();
            }
            catch (err) {
                console.error("インポートエラー:", err);
            }
        };
    }
    // 3. ホームボタン（タイムラインを最新にする）
    const homeBtn = document.getElementById("to-home");
    if (homeBtn) {
        homeBtn.onclick = () => {
            refreshTimeline();
            window.scrollTo(0, 0);
        };
    }
};
//サーバーから投稿を取得して画面に表示
export const refreshTimeline = async () => {
    const token = localStorage.getItem("token");
    const listContainer = document.getElementById("posts-list");
    if (listContainer)
        listContainer.innerHTML = "<p>わんこを探しています...</p>";
    try {
        const response = await fetch("/posts", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("届いたデータ:", data[0]);
        if (listContainer) {
            renderPosts(Array.isArray(data) ? data : [], listContainer);
        }
    }
    catch (error) {
        // 💡 失敗した時も listContainer を渡す
        if (listContainer) {
            renderPosts([], listContainer);
        }
    }
};
export const renderPosts = (posts, container, isGrid = false) => {
    if (!container)
        return;
    // 1. 投稿がない場合の表示
    if (!Array.isArray(posts) || posts.length === 0) {
        container.innerHTML = "<p>まだ投稿がないか、読み込みに失敗しました🐾</p>";
        return;
    }
    if (isGrid) {
        container.classList.add("post-grid");
    }
    else {
        container.classList.remove("post-grid");
    }
    container.innerHTML = posts
        .map((post) => {
        const imagesHtml = post.image_urls && post.image_urls.length > 0
            ? `<div class="post-image-wrapper">
             ${post.image_urls.map((url) => `<img src="${url}" alt="わんこの写真" class="post-photo">`).join("")}
           </div>`
            : "";
        const heartIcon = post.is_liked ? "❤️" : "🐾";
        const likedClass = post.is_liked ? "is-liked" : "";
        return `
        <article class="post-card" data-post-id="${post.id}">
            <header class="post-header">
                <span class="user-name">${post.user_name || "名無しさん"}</span>
                <span class="breed-tag"># ${post.breed_name || "不明"}</span>
            </header>
            
            ${imagesHtml}
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <footer class="post-footer">
                <div class="post-actions">
                  <button class="like-btn ${likedClass}" data-post-id="${post.id}">
                    <span class="like-icon">${heartIcon}</span>
                    <span class="like-count">${post.like_count || 0}</span>
                  </button>
                </div>
                <time>${new Date(post.created_at).toLocaleString()}</time>
            </footer>
        </article>
      `;
    })
        .join("");
    // 3. いいねボタンのイベント登録
    setupLikeButtons();
    // 💡 3. モーダル表示用のクリックイベント登録（isGridの時だけ）
    if (isGrid) {
        setupPostModalEvents(container, posts);
    }
};
/**
 * モーダル表示のためのイベント設定
 */
const setupPostModalEvents = (container, posts) => {
    const postCards = container.querySelectorAll(".post-card");
    postCards.forEach((card) => {
        card.addEventListener("click", (e) => {
            // いいねボタンをクリックした時はモーダルを開かないようにする
            if (e.target.closest(".like-btn"))
                return;
            const postId = Number(card.getAttribute("data-post-id"));
            const targetPost = posts.find((p) => p.id === postId);
            if (targetPost) {
                openPostModal(targetPost);
            }
        });
    });
};
/**
 * モーダルを開いて中身を書き換える
 */
const openPostModal = (post) => {
    const modal = document.getElementById("post-modal");
    const modalDetail = document.getElementById("modal-post-detail");
    if (!modal || !modalDetail)
        return;
    const heartIcon = post.is_liked ? "❤️" : "🐾";
    // モーダルの内側を「タイムラインと同じカード形式」で作成
    // ここで renderPosts を再利用するのではなく、単体の HTML を生成
    modalDetail.innerHTML = `
    <div class="post-card">
      <header class="post-header">
        <span class="user-name">${post.user_name}</span>
        <span class="breed-tag"># ${post.breed_name}</span>
      </header>
      <div class="post-image-wrapper">
        <img src="${post.image_urls[0]}" class="post-photo">
      </div>
      <div class="post-content">
        <p>${post.content}</p>
      </div>
      <footer class="post-footer">
       <div class="post-actions">
        <button class="like-btn ${post.is_liked ? "is-liked" : ""}" data-post-id="${post.id}">
         <span class="like-icon">${heartIcon}</span>
         <span class="like-count"><strong>${post.like_count || 0}</strong> Likes</span>
        </button>
       </div>
        <time>${new Date(post.created_at).toLocaleString()}</time>
      </footer>
    </div>
  `;
    modal.style.display = "flex";
    setupLikeButtons();
    // 閉じる処理
    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }
    // 背景クリックで閉じる
    modal.onclick = (e) => {
        if (e.target === modal)
            modal.style.display = "none";
    };
};
/**
 * 全てのいいねボタンにクリックイベントを設定する
 */
const setupLikeButtons = () => {
    const likeButtons = document.querySelectorAll(".like-btn");
    likeButtons.forEach((el) => {
        // 💡 Element を HTMLElement に変換して扱う
        const btn = el;
        btn.onclick = async () => {
            const postId = btn.getAttribute("data-post-id");
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`/posts/${postId}/like`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const result = await response.json();
                    const icon = btn.querySelector(".like-icon");
                    const count = btn.querySelector(".like-count");
                    if (icon)
                        icon.innerHTML = result.liked ? "❤️" : "🐾";
                    if (count)
                        count.innerHTML = result.count;
                    btn.classList.toggle("is-liked", result.liked);
                }
            }
            catch (error) {
                console.error("いいね失敗:", error);
            }
        };
    });
};
//# sourceMappingURL=timeline.js.map