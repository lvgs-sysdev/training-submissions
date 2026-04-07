import { setupPostForm } from "../posts/post.js";
import { PostApi } from "../../utils/api.js";
import { Post } from "../posts/type.js";
import * as UI from "./timelineUI.js";
import { initNavigation } from "./navigation.js";
import { initBreedSearch } from "./breedSearch.js";
import { createPostCardHtml } from "../posts/components.js";
import { renderPostList } from "../posts/components.js";

/**
 * タイムラインの全体初期化
 */
export const initTimeline = async (containerId: string): Promise<void> => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch("/feed/timeline.html");
    container.innerHTML = await response.text();

    setupPostForm();
    initNavigation();
    await initBreedSearch();
    await refreshTimeline();
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>初期化に失敗しました🐾</p>";
  }
};

/**
 * データを再取得して画面を更新
 */
export const refreshTimeline = async (searchWord?: string) => {
  const listContainer = document.getElementById("posts-list");
  if (!listContainer) return;
  try {
    const posts = await PostApi.fetchTimeline(searchWord);
    renderPostList(listContainer, posts);
  } catch (error) {
    UI.showError(listContainer);
  }
};

/**
 * 操作（クリック等）のイベント設定
 */
export const setupInteractiveEvents = (
  container: HTMLElement,
  posts: Post[],
) => {
  // 1. いいねボタンの制御
  container.querySelectorAll(".like-btn").forEach((el) => {
    const btn = el as HTMLElement;
    btn.onclick = async (e: MouseEvent) => {
      e.stopPropagation();
      const postId = Number(btn.getAttribute("data-post-id"));

      try {
        // --- Model (API) に依頼 ---
        const result = await PostApi.toggleLike(postId);

        // --- View (UI) に反映を依頼 ---
        // 💡 具体的なDOM操作はUI層に丸投げ！
        UI.updateLikeStatus(postId, result.liked, result.count);

        // --- Model (メモリ上のデータ) も更新 ---
        const postData = posts.find((p) => p.id === postId);
        if (postData) {
          postData.is_liked = result.liked;
          postData.like_count = result.count;
        }
      } catch (error) {
        console.error("Like failed:", error);
      }
    };
  });

  // モーダルオープン
  container.querySelectorAll(".post-card").forEach((card) => {
    // 💡 HTMLElement にキャストして onclick を使えるようにする
    (card as HTMLElement).onclick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".like-btn, .user-name")) return;
      const postId = Number(card.getAttribute("data-post-id"));
      const post = posts.find((p) => p.id === postId);
      if (post) openPostModal(post);
    };
  });

  // ユーザー名クリック
  container.querySelectorAll(".user-name").forEach((el) => {
    (el as HTMLElement).onclick = async (e: MouseEvent) => {
      e.stopPropagation();
      const userId = Number(el.getAttribute("data-user-id"));
      const { initMypage } = await import("../../mypage/mypage.js");
      initMypage(userId);
    };
  });
};

/**
 * モーダル制御
 */
const openPostModal = (post: Post) => {
  const modal = document.getElementById("post-modal")!;
  const modalDetail = document.getElementById("modal-post-detail")!;

  modalDetail.innerHTML = createPostCardHtml(post, true);
  modal.style.display = "flex";

  UI.initCardUI(modalDetail);
  setupInteractiveEvents(modalDetail, [post]);

  const closeBtn = document.getElementById("close-modal");
  if (closeBtn) closeBtn.onclick = () => (modal.style.display = "none");

  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
};
