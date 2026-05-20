import DOMPurify from "dompurify";

export const updateTopPage = async () => {
  const container = document.querySelector(".app");
  if (!container) {
    return;
  } else {
    container.innerHTML = ``;
    const htmlTemplate = `
      <h1 class="app-name">ようこそ<br />Nature-Lensへ</h1>
      <h2 class="app-caption">
        あなたの周りで過去に観察された生物を<br />スキャンしましょう
      </h2>
      <button type="button" class="button-common registerPage_button">新規登録</button>
      <button type="button" class="button-common loginPage_button">ログイン</button>
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
  }
};
