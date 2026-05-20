// frontend/src/mypage/mypage.ts
import { PostApi } from "../utils/api";
import { initNavigation } from "../feed/timeline/navigation";
import { Post } from "../feed/posts/type";
import { MypageView } from "./mypageView";
import { renderPostList } from "../feed/posts/components";

export const initMypage = async (userId?: number) => {
  const mainContainer = document.querySelector(".app-container") as HTMLElement;
  if (!mainContainer) return;

  try {
    const htmlRes = await fetch("/mypage/mypage.html");
    mainContainer.innerHTML = await htmlRes.text();

    const data = await PostApi.fetchMypage(userId);

    // View に描画を依頼
    MypageView.renderProfile(data.profile);
    setupActionButton(data.profile, userId);
    renderMypagePosts(data.posts);

    setupMypageEvents(userId);
    initNavigation();
  } catch (error) {
    console.error("Mypage Init Error:", error);
    mainContainer.innerHTML = "<p>読み込みに失敗しました🐾</p>";
  }
};

/**
 * アクションボタン（編集 or フォロー）の制御
 */
const setupActionButton = (profile: any, userId?: number) => {
  const currentUserId = Number(localStorage.getItem("userId"));
  const btn = document.getElementById("edit-profile-btn") as HTMLButtonElement;
  if (!btn) return;

  const isMe = !userId || userId === currentUserId;

  if (isMe) {
    btn.textContent = "編集";
    btn.onclick = () => MypageView.showEditModal(profile);
  } else {
    btn.textContent = profile.is_following ? "フォロー解除" : "フォローする";
    btn.onclick = async () => {
      await PostApi.toggleFollow(userId!);
      initMypage(userId); // 再読み込み
    };
  }
};

/**
 * 編集イベントの登録
 */
const setupMypageEvents = (userId?: number) => {
  const form = document.getElementById("edit-profile-form") as HTMLFormElement;
  const imageInput = document.getElementById("edit-image") as HTMLInputElement;

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (file) MypageView.renderImagePreview(file);
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await PostApi.updateProfile(new FormData(form));
      alert("プロフィールを更新しました🐾");
      MypageView.hideEditModal();
      initMypage(userId);
    } catch (err) {
      alert("更新に失敗しました。");
    }
  });

  document.getElementById("close-edit-modal")!.onclick = () =>
    MypageView.hideEditModal();

  document.getElementById("to-home")!.onclick = async () => {
    const { initTimeline } = await import("../feed/timeline/timeline.js");
    initTimeline("root");
  };
};

/**
 * 投稿一覧の描画
 */
const renderMypagePosts = (posts: Post[]) => {
  const container = document.getElementById("posts-container");
  if (container) {
    renderPostList(container, posts, "post-grid");
  }
};
