import DOMPurify from "dompurify";

export const updateRegisterPage = async () => {
  const container = document.querySelector(".app") as HTMLElement;

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
      <p class="page-name">新規ユーザ登録</p>
    </div>
    <ul class="registerForm">
      <li class="registerForm__potision">
        <label class="registerForm_name">
          ユーザID
          <input
            class="registerForm_input"
            type="text"
            pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$"
            title="英字と数字をそれぞれ1文字以上含む10〜30文字で入力してください"
            name="user_ID"
            value=""
            required />
        </label>
        <p class="registerForm_caution">大小英字数字と記号（10~30文字）</p>
        <p class="registerForm_caution">使える記号 !@#$%^&*</p>
        <p class="registerForm_caution">少なくとも英字と数字を一文字ずつ含む</p>
      </li>
      <li class="registerForm__potision">
        <label class="registerForm_name">
          ユーザ名
          <input
            class="registerForm_input"
            type="text"
            pattern="^[A-Za-z].{5,20}$"
            title="大文字小文字の英字で入力してください(5~20文字以内)"
            name="user_name"
            value=""
            required />
        </label>
        <p class="registerForm_caution">大小英字のみ（5~20文字）</p>
      </li>
      <li class="registerForm__potision">
        <label class="registerForm_name">
          パスワード
          <input
            class="registerForm_input"
            type="password"
            pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$"
            title="英字と数字をそれぞれ1文字以上含む10〜30文字で入力してください"
            name="password"
            value=""
            required />
        </label>
        <p class="registerForm_caution">大小英字数字と記号（10~30文字）</p>
        <p class="registerForm_caution">使える記号 !@#$%^&*</p>
        <p class="registerForm_caution">少なくとも英字と数字を一文字ずつ含む</p>
      </li>
    </ul>
    <button type="button" class="button-common register_button">
      <p>登録</p>
    </button>
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
    container.style.display = "block";
    container.style.visibility = "visible";
    container.style.opacity = "1";
  }
};
