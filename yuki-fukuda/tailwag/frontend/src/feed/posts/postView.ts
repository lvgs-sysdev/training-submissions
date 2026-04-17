import { clearSelectedBreeds } from "../timeline/breedSearch";

export const PostView = {
  // HTML要素の取得をまとめる
  getElements: () => ({
    form: document.getElementById("post-form") as HTMLFormElement,
    contentInput: document.getElementById(
      "post-content",
    ) as HTMLTextAreaElement,
    fileInput: document.getElementById("post-images") as HTMLInputElement,
    previewContainer: document.getElementById(
      "image-preview-container",
    ) as HTMLElement,
  }),

  // プレビュー画像の描画
  renderPreviews: (files: FileList | null, container: HTMLElement) => {
    container.innerHTML = "";
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;
        img.className = "post-preview-img";
        img.alt = "投稿画像のプレビュー";
        container.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  },

  // フォームのリセット
  reset: (form: HTMLFormElement, container: HTMLElement) => {
    form.reset();
    container.innerHTML = "";
    clearSelectedBreeds();
  },
};
