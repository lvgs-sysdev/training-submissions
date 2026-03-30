export function setupArticleFormValidation(submitButtonId, opts = {}) {
  const form = document.querySelector(opts.formSelector ?? ".article-edit-form");
  if (!form) {
    console.warn("[form-validation] form not found");
    return;
  }
  const submitBtn = document.getElementById(submitButtonId);
  let textareaValid = false;

  const fallbackTextareaValid = () => {
    const t = Array.from(form.querySelectorAll("textarea"));
    return t.length > 0 && t.some(x => x.value && x.value.trim() !== "");
  };

  // エラーメッセージユーティリティ
  const MESSAGES = { required: "必須項目です" };
  const showError = (el, msg) => {
    if (!el || !el.parentElement) return;
    clearError(el);
    const d = document.createElement("div");
    d.className = "field-error";
    d.textContent = msg;
    el.parentElement.insertBefore(d, el.nextSibling);
  };
  const clearError = (el) => {
    if (!el || !el.parentElement) return;
    const errorMessages = el.parentElement.querySelectorAll(".field-error");
    errorMessages.forEach(ex => ex.remove());
  };

  const requiredFields = {
    title: form.querySelector("#title"),
    genre: form.querySelector('[name="genre"]'),
    tag: form.querySelector('[name="tag"]'),
    "sub-heading": form.querySelector("#sub-heading"),
  };

  const requiredFieldsValid = (show = false) => {
    let allValid = true;
    Object.values(requiredFields).forEach((el) => {
      if (!el) return;
      const val = (el.value ?? "").toString().trim();
      if (!val) {
        allValid = false;
        if (show) showError(el, MESSAGES.required);
      } else {
        clearError(el);
      }
    });
    return allValid;
  };

  const update = () => {
    const reqOk = requiredFieldsValid(false);
    const textOk = textareaValid || fallbackTextareaValid();
    const ok = reqOk && textOk;
    if (submitBtn) submitBtn.disabled = !ok;
  };

  (async () => {
    try {
      const mod = await import("/scripts/textarea-validation.js");
      if (mod && typeof mod.setupTextareaValidation === "function") {
        mod.setupTextareaValidation(form, valid => {
          textareaValid = !!valid;
          update();
        });
        update();
        return;
      }
    } catch (e) {
      // import 失敗は無視してフォールバックを使う
    }

    if (typeof window.setupTextareaValidation === "function") {
      try {
        window.setupTextareaValidation(form, valid => {
          textareaValid = !!valid;
          update();
        });
        update();
        return;
      } catch (e) {}
    }

    update();
  })();

  // blur で必須エラーを表示
  Object.values(requiredFields).forEach((el) => {
    if (!el) return;
    el.addEventListener("blur", () => {
      requiredFieldsValid(true);
      update();
    });
    // input 中はエラーメッセージを消す
    el.addEventListener("input", () => {
      if (el.value && el.value.toString().trim() !== "") clearError(el);
      update();
    });
  });

  form.addEventListener("input", update);
  update();
}
