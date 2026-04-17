import { Post } from "../posts/type";
import { createPostCardHtml, updateImageCounter } from "../posts/components";

/**
 * タイムラインのメイン表示
 */
export const renderTimeline = (posts: Post[], container: HTMLElement) => {
  if (posts.length === 0) {
    container.innerHTML = `<div class="status-msg"><p>投稿が見つかりませんでした🐾</p></div>`;
    return;
  }
  container.innerHTML = posts.map((post) => createPostCardHtml(post)).join("");
};

/**
 * ローディング状態の表示
 */
export const showLoading = (container: HTMLElement) => {
  container.innerHTML = `<div class="status-msg"><p>わんこを探しています...🐾</p></div>`;
};

/**
 * エラー状態の表示
 */
export const showError = (container: HTMLElement) => {
  container.innerHTML = `<div class="status-msg"><p>通信エラーが発生しました🐾</p></div>`;
};

/**
 * 各カードに付随するView固有の設定（スクロール等）
 */
export const initCardUI = (container: HTMLElement) => {
  container.querySelectorAll(".post-image-wrapper").forEach((el) => {
    el.addEventListener("scroll", () => updateImageCounter(el as HTMLElement), {
      passive: true,
    });
  });
};

/**
 * 💡 いいねボタンの表示状態を一括更新する (View)
 */
export const updateLikeStatus = (
  postId: number,
  isLiked: boolean,
  count: number,
) => {
  // ページ内の該当する投稿ボタンをすべて探す（タイムライン & モーダル内）
  const relatedBtns = document.querySelectorAll(
    `.like-btn[data-post-id="${postId}"]`,
  );

  relatedBtns.forEach((btn) => {
    const icon = btn.querySelector(".like-icon");
    const countSpan = btn.querySelector(".like-count");

    // アイコンと数値の書き換え
    if (icon) icon.innerHTML = isLiked ? "❤️" : "🐾";
    if (countSpan) countSpan.innerHTML = String(count);

    // クラスの付け外し
    if (isLiked) {
      btn.classList.add("is-liked");
    } else {
      btn.classList.remove("is-liked");
    }
  });
};
