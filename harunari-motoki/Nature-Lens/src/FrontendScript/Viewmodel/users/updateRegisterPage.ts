import DOMPurify from "dompurify";

export const updateRegisterPage = async () => {
  const container = document.querySelector(".app") as HTMLElement;

  if (!container) {
    console.error("HTMLエラー");
    throw new Error("");
  } else {
    //画面初期化
    container.innerHTML = ``;
    const htmlTemplate = `
      <button type="button" class="toppage_button">
        <p>トップページ</p>
      </button>
      <div>
        <p>新規ユーザ登録</p>
      </div>
      <ul class="registerForm">
        <li>
          <label>
            ユーザID
            <input
             type="text" 
             pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$"
             title="英字と数字をそれぞれ1文字以上含む10〜30文字で入力してください" 
             name="user_ID" 
             value= "" 
             required>
          </label>
          <p>大小英字数字と記号（10~30文字）</p>
          <p>使える記号 !@#$%^&*</p>
          <p>少なくとも英字と数字を一文字ずつ含む</p><br>
        </li>
        <li>
          <label>
            ユーザ名
            <input 
            type="text" 
            pattern="^[A-Za-z].{5,20}$" 
            title="大文字小文字の英字で入力してください(5~20文字以内)" 
            name="user_name" 
            value= "" 
            required>
          </label>
          <p>大小英字のみ（5~20文字）</p><br>
        </li>
        <li>
          <label>
            パスワード
            <input 
            type="password"
            pattern="^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{10,30}$"
            title="英字と数字をそれぞれ1文字以上含む10〜30文字で入力してください" 
            name="password" 
            value= "" 
            required >
          </label>
          <p>大小英字数字と記号（10~30文字）</p>
          <p>使える記号 !@#$%^&*</p>
          <p>少なくとも英字と数字を一文字ずつ含む</p>
        </li>
      </ul>
      <button type="button" class="register_button">
        <p>登録</p>
      </button>
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;

    // 赤い線を消して、最低限の表示設定だけ残す
    container.style.display = "block";
    container.style.visibility = "visible";
    container.style.opacity = "1";
  }
};

//.appのCSSに以下の内容を記述する
// .appの中身が０になってしまって要素を記述できなかったためにHTMLが作成されたもページが遷移したように見えなかった
// .app {
//   display: block;      /* 非表示にならないように */
//   min-height: 100vh;   /* 画面いっぱいの高さを確保 */
//   width: 100%;
//   visibility: visible;
//   opacity: 1;
// }
