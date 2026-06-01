// 画像プレビュー・ファイル名表示の共通関数をimport
import { setupPreview, showFileName } from "/scripts/article-image-utils.js";

// フォーム初期化・値セットアップなどのメイン処理
export function setupArticleEditForm(submitButtonId) {
  const form = document.querySelector(".article-edit-form");
  if (!form) return;
  let initial = null;
  try {
    const raw = form.dataset.initial;
    if (raw) initial = JSON.parse(raw);
  } catch (e) {
    console.error("initial parse error", e);
  }

  // フィールド一覧（存在すれば値を入れる）
  const setIfExists = (selector, value) => {
    const el = form.querySelector(selector);
    if (!el || value === undefined || value === null) return;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  if (initial) {
    setIfExists('[name="genre"]', initial.genre);
    setIfExists('[name="tag"]', initial.tag);
    setIfExists('[name="title"]', initial.title);
    setIfExists('[name="img-caption"]', initial.imgCaption || initial.imgCaptionText || "");
    setIfExists('[name="sub-heading"]', initial.subHeading || "");

    // テキストエリアの id に対応するプリフィル（body1, body2...body7）
    for (let i = 1; i <= 7; i++) {
      const id = `body${i}`;
      setIfExists(`#${id}`, initial[`body${i}`] ?? initial[`body`] ?? "");
    }

    const previewFields = [
      { input: "#image1", preview: "#preview1", url: initial.image1Url || initial.images?.[0] },
      { input: "#image2", preview: "#preview2", url: initial.image2Url || initial.images?.[1] },
      { input: "#image3", preview: "#preview3", url: initial.image3Url || initial.images?.[2] },
    ];
    previewFields.forEach(p => {
      if (p.url) {
        const img = form.querySelector(p.preview);
        if (img) {
          img.src = p.url;
          img.style.display = "";
        }
      }
    });
  }

  // 画像プレビューのセットアップ（importした共通関数を利用）
  setupPreview("#image1", "#preview1");
  setupPreview("#image2", "#preview2");
  setupPreview("#image3", "#preview3");

  // ファイル名表示のセットアップ（ここに書く）
  showFileName("#image1", "#fileName1", initial?.image1Url || initial?.images?.[0]);
  showFileName("#image2", "#fileName2", initial?.image2Url || initial?.images?.[1]);
  showFileName("#image3", "#fileName3", initial?.image3Url || initial?.images?.[2]);
}
