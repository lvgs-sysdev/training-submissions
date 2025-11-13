import { setupArticleEditForm } from "/scripts/article-edit-page.js";
import { setupArticleFormSubmission } from "/scripts/article-form-submit.js";
import { setupArticleFormValidation } from "/scripts/article-edit-page-validation.js";
import { setupTextareaValidation } from "/scripts/textarea-validation.js";

const form = document.querySelector(".article-edit-form");
const submitButton = document.getElementById("submit-button");

if (form) {
  setupArticleEditForm(submitButton.id);

  setupTextareaValidation(form, (isValid) => {
    form.dispatchEvent(
      new CustomEvent("validationChange", {
        detail: { isValid, source: "textareas" },
      })
    );
  });

  setupArticleFormValidation(submitButton.id);

  if (submitButton) {
    setupArticleFormSubmission(form, submitButton);
  }
}
