import { refreshTimeline, selectedBreeds, clearSelectedBreeds, } from "./timeline.js";
export const setupPostForm = () => {
    console.log("setupPostForm が呼び出されました！");
    // --- 1. 要素の取得 (ここでしっかり定義する) ---
    const form = document.getElementById("post-form");
    const contentInput = document.getElementById("post-content");
    const fileInput = document.getElementById("post-images");
    const previewContainer = document.getElementById("image-preview-container");
    if (!form || !fileInput || !contentInput || !previewContainer) {
        console.error("必要なフォーム要素が見つかりません。");
        return;
    }
    // --- 2. 画像プレビュー処理 ---
    fileInput.addEventListener("change", () => {
        previewContainer.innerHTML = ""; // プレビューを一旦クリア
        if (fileInput.files && fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach((file) => {
                if (!file.type.startsWith("image/"))
                    return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement("img");
                    img.src = e.target?.result;
                    // スタイル設定
                    img.style.width = "80px";
                    img.style.height = "80px";
                    img.style.objectFit = "cover";
                    img.style.borderRadius = "8px";
                    img.style.marginRight = "8px";
                    img.style.border = "1px solid #ddd";
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    });
    // --- 3. 送信処理 ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const token = localStorage.getItem("token");
        if (!token)
            return alert("ログインしてね🐾");
        // バリデーション
        if (!contentInput.value.trim() &&
            (!fileInput.files || fileInput.files.length === 0)) {
            return alert("内容または画像を入力してね");
        }
        const formData = new FormData();
        formData.append("content", contentInput.value);
        // 犬種タグの追加
        const breedIds = selectedBreeds.map((b) => b.id);
        formData.append("breed_ids", JSON.stringify(breedIds));
        // 画像の追加
        if (fileInput.files) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append("images", fileInput.files[i]);
            }
        }
        try {
            console.log("投稿を送信中...");
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (response.ok) {
                alert("投稿完了！🐾");
                form.reset(); // フォームをリセット
                previewContainer.innerHTML = ""; // プレビューを消す
                if (typeof clearSelectedBreeds === "function") {
                    clearSelectedBreeds(); // 犬種タグをリセット
                }
                await refreshTimeline(); // タイムライン更新
            }
            else {
                const err = await response.json();
                alert(`エラー: ${err.message}`);
            }
        }
        catch (error) {
            console.error("投稿エラー:", error);
            alert("通信に失敗しました");
        }
    });
};
//# sourceMappingURL=post.js.map