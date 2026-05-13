import DOMPurify from "dompurify";

export const updateLoginPage = async () => {
  const container = document.querySelector(".app") as HTMLElement;
  console.log("updateLoginPage.tsどこで動いた？");
  if (!container) {
    console.error("HTMLエラー");
    throw new Error("");
  } else {
    container.innerHTML = ``;
    const htmlTemplate = `
       <button type="button" class="button-common toppage_button">
      <p>トップページ</p>
    </button>
    <div>
      <p class="page-name">ログイン</p>
    </div>
    <ul class="loginForm">
      <li class="loginForm__potision">
        <label class="loginForm_name">
          ユーザID
          <input
            class="loginForm_input"
            type="text"
            pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$"
            title="英字と数字をそれぞれ1文字以上含む10〜30文字で入力してください"
            name="user_ID"
            value=""
            required />
        </label>
        <p class="loginForm_caution">大小英字数字と記号（10~30文字）</p>
        <p class="loginForm_caution">使える記号 !@#$%^&*</p>
        <p class="loginForm_caution">少なくとも英字と数字を一文字ずつ含む</p>
      </li>
      <li class="loginForm__potision">
        <label class="loginForm_name">
          パスワード
          <input
            class="loginForm_input"
            type="password"
            pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$"
            title="英字と数字をそれぞれ1文字以上含む10〜30文字で入力してください"
            name="password"
            value=""
            required />
        </label>
        <p class="loginForm_caution">大小英字数字と記号（10~30文字）</p>
        <p class="loginForm_caution">使える記号 !@#$%^&*</p>
        <p class="loginForm_caution">少なくとも英字と数字を一文字ずつ含む</p>
      </li>
    </ul>
    <button type="button" class="button-common login_button">
    <p>ログイン</p>
    </button>
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
    container.style.display = "block";
    container.style.visibility = "visible";
    container.style.opacity = "1";
  }
};
