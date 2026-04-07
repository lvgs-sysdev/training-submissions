// 💡 先ほど作成した type.ts からインポート
import { Post } from "./type.js";
import { escapeHtml } from "../../utils/escape.js";
import { setupInteractiveEvents } from "../timeline/timeline.js";

/**
 * 画像スライダーのHTMLを生成
 */
export const createImagesHtml = (imageUrls: string[]) => {
  // 💡 string[] 型を指定
  if (!imageUrls || imageUrls.length === 0) return "";

  return `
    <div class="post-image-container">
      <div class="post-image-wrapper">
        ${imageUrls.map((url: string) => `<img src="${url}" alt="写真" class="post-photo">`).join("")}
      </div>
      ${imageUrls.length > 1 ? `<span class="image-counter">1 / ${imageUrls.length}</span>` : ""}
    </div>`;
};

/**
 * 投稿カード全体のHTMLを生成
 */
export const createPostCardHtml = (post: Post, isModal: boolean = false) => {
  const userIconUrl = post.profile_image_url || "/img/default-icon.png";
  const imagesHtml = createImagesHtml(post.image_urls);

  // 💡 表示前にユーザー入力値をエスケープする
  const safeUserName = escapeHtml(post.user_name || "名無しさん");
  const safeBreedName = escapeHtml(post.breed_name || "不明");
  const safeContent = escapeHtml(post.content);

  return `
    <article class="post-card" data-post-id="${post.id}">
      <header class="post-header">
        <div class="user-info-wrapper">
          <img src="${userIconUrl}" class="user-icon-small">
          <span class="user-name" data-user-id="${post.user_id}" style="cursor: pointer;">
            ${safeUserName}
          </span>
        </div>
        <span class="breed-tag"># ${safeBreedName}</span>
      </header>
      ${imagesHtml}
      <div class="post-content">
        <p>${safeContent}</p>
      </div>
      <footer class="post-footer">
        <div class="post-actions">
          <button class="like-btn ${post.is_liked ? "is-liked" : ""}" data-post-id="${post.id}">
            <span class="like-icon">${post.is_liked ? "❤️" : "🐾"}</span>
            <span class="like-count">${isModal ? `<strong>${post.like_count || 0}</strong> Likes` : post.like_count || 0}</span>
          </button>
        </div>
        <time>${new Date(post.created_at).toLocaleString()}</time>
      </footer>
    </article>`;
};

/**
 * 画像カウンターの更新ロジック
 */
export const updateImageCounter = (wrapper: HTMLElement) => {
  // 💡 HTMLElement 型を指定
  const container = wrapper.closest(".post-image-container");
  const counterSpan = container?.querySelector(".image-counter");
  if (!counterSpan) return;

  const clientWidth = wrapper.clientWidth;
  if (clientWidth === 0) return;

  const currentPage = Math.round(wrapper.scrollLeft / clientWidth) + 1;
  const totalPages = wrapper.querySelectorAll(".post-photo").length;
  counterSpan.textContent = `${currentPage} / ${totalPages}`;
};

/**
 * 💡 投稿リストをコンテナ内に描画し、全イベントを紐付ける共通関数
 */
export const renderPostList = (
  container: HTMLElement,
  posts: Post[],
  customClass?: string,
) => {
  if (!container || !posts) return;

  //  HTML生成と挿入
  container.innerHTML = posts.map((p) => createPostCardHtml(p)).join("");

  if (customClass) {
    container.classList.add(customClass);
  }

  //  画像スライダーのカウンター更新イベント登録
  container.querySelectorAll(".post-image-wrapper").forEach((el) => {
    el.addEventListener("scroll", () => updateImageCounter(el as HTMLElement), {
      passive: true,
    });
  });

  //  いいね、モーダル、ユーザー遷移などの全インタラクションを登録
  setupInteractiveEvents(container, posts);
};
