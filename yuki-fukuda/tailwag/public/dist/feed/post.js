import { refreshTimeline } from "./timeline.js";
export const setupPostForm = () => {
    console.log("setupPostForm が呼び出されました！");
    const form = document.getElementById("post-form");
    const contentInput = document.getElementById("post-content"); // ID修正
    const breedSelect = document.getElementById("breed-select");
    const fileInput = document.getElementById("post-images");
    console.log("fileInput の取得結果:", fileInput);
    if (!fileInput) {
        console.error("エラー: #post-images が見つかりません。HTMLの読み込みを待つ必要があります。");
        return;
    }
    const previewContainer = document.getElementById("image-preview-container");
    // --- 画像を選択した時にプレビューを表示する処理 ---
    fileInput?.addEventListener("change", () => {
        if (!previewContainer)
            return;
        previewContainer.innerHTML = ""; // 一旦クリア
        if (fileInput.files) {
            Array.from(fileInput.files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement("img");
                    img.src = e.target?.result;
                    img.style.width = "80px";
                    img.style.height = "80px";
                    img.style.objectFit = "cover";
                    img.style.borderRadius = "8px";
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    });
    // --- 送信処理 ---
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation(); // 念のためイベントの伝播も止める
        console.log("投稿ボタンが押されました。処理を開始します...");
        const token = localStorage.getItem("token");
        if (!token)
            return alert("ログインしてね🐾");
        // 1. FormData オブジェクトを作成（画像とテキストを混ぜるため）
        const formData = new FormData();
        formData.append("content", contentInput.value);
        // 2. 選択された犬種ID（複数）を配列にして追加
        const selectedBreeds = Array.from(breedSelect.selectedOptions).map((opt) => Number(opt.value));
        formData.append("breed_ids", JSON.stringify(selectedBreeds));
        // 3. 画像ファイルを追加（複数）
        if (fileInput.files) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append("images", fileInput.files[i]);
            }
        }
        if (!contentInput.value &&
            (!fileInput.files || fileInput.files.length === 0)) {
            return alert("内容または画像を入力してね");
        }
        try {
            const response = await fetch("/posts", {
                method: "POST",
                headers: {
                    // ★重要: FormDataを使う時は Content-Type ヘッダーは手動で書かない！
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (response.ok) {
                alert("投稿完了！🐾");
                form.reset();
                if (previewContainer)
                    previewContainer.innerHTML = "";
                await refreshTimeline(); // タイムラインを更新
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