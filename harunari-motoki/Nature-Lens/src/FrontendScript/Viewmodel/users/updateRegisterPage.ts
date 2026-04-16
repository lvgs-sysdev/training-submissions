import DOMPurify from "dompurify";

export const updateRegisterPage = async () => {
  const container = document.querySelector(".app");

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
            <input type="text" name="user_ID">
          </label>
        </li>
        <li>
          <label>
            ユーザ名
            <input type="text" name="user_name">
          </label>
        </li>
        <li>
          <label>
            パスワード
            <input type="text" name="password">
          </label>
        </li>
      </ul>
      <button type="button" class="register">
        <p>登録</p>
      </button>
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
    console.log(container.innerHTML);

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
