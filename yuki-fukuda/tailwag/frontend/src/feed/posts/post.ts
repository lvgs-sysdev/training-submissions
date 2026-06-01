// frontend/src/feed/posts/post.ts
import { PostApi } from "../../utils/api";
import { selectedBreeds } from "../timeline/breedSearch";
import { refreshTimeline } from "../timeline/timeline";
import { PostView } from "./postView";

export const setupPostForm = () => {
  const { form, contentInput, fileInput, previewContainer } =
    PostView.getElements();

  if (!form || !fileInput || !previewContainer) return;

  // --- 画像選択時の動き (Viewに任せる) ---
  fileInput.addEventListener("change", () => {
    PostView.renderPreviews(fileInput.files, previewContainer);
  });

  // --- 送信時の動き  ---
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("ログインしてね🐾");

    // 1. データのバリデーション
    const content = contentInput.value.trim();
    const files = fileInput.files;
    // 画像が1枚も選ばれていない場合はここで即座に終了
    if (!files || files.length === 0) {
      return alert("画像を1枚以上選択してね🐾");
    }

    if (!content) {
      return alert("内容を入力してね");
    }

    // 2. 送信用データの準備
    const formData = new FormData();
    formData.append("content", content);
    formData.append(
      "breed_ids",
      JSON.stringify(selectedBreeds.map((b) => b.id)),
    );
    if (files) {
      Array.from(files).forEach((file) => formData.append("images", file));
    }

    // 3. API実行 (Modelへ依頼)
    try {
      const result = await PostApi.createPost(formData);
      if (result) {
        alert("投稿完了！🐾");
        // 4. Viewの状態をリセット
        PostView.reset(form, previewContainer);
        await refreshTimeline();
      }
    } catch (error) {
      console.error("Post error:", error);
      alert("投稿に失敗しました");
    }
  });
};
