// プレビュー表示、ファイル名表示など
// 画像プレビュー表示
export function setupPreview(inputSelector, previewSelector) {
  const input = document.querySelector(inputSelector);
  const preview = document.querySelector(previewSelector);
  if (!input || !preview) return;
  input.addEventListener("change", () => {
    const f = input.files && input.files[0];
    if (!f) {
      preview.src = "";
      preview.style.display = "none";
      preview.classList.add('loading');
      return;
    }
    const url = URL.createObjectURL(f);
    preview.classList.add('loading');
    preview.src = url;
    preview.style.display = "";
    preview.onload = () => {
      preview.classList.remove('loading');
      URL.revokeObjectURL(url);
    };
  });
}

// ファイル名表示
export function showFileName(inputSelector, labelSelector, initialUrl) {
  const input = document.querySelector(inputSelector);
  const label = document.querySelector(labelSelector);
  if (!input || !label) return;

  input.addEventListener("change", () => {
    if (input.files && input.files[0]) {
      label.textContent = input.files[0].name;
    } else if (initialUrl) {
      label.textContent = initialUrl.split('/').pop();
    } else {
      label.textContent = "ファイル未選択";
    }
  });

  // 初期表示
  if (initialUrl) {
    label.textContent = initialUrl.split('/').pop();
  } else {
    label.textContent = "ファイル未選択";
  }
}
