import DOMPurify from "dompurify";

export const updateTopPage = async () => {
  const container = document.querySelector(".app");
  if (!container) {
    return;
  } else {
    container.innerHTML = ``;
    const htmlTemplate = `
      <button type="button" class="register_button">新規登録</button><br />
      <div class="register-container"></div>
      <button type="button" class="login_button">ログイン</button>
      <div class="login-container"></div>
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
  }
};
