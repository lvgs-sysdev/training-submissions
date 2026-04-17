import DOMPurify from "dompurify";

export const updateLoginPage = async () => {
  const container = document.querySelector(".app");
  console.log("updateLoginPage.tsどこで動いた？");
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
        <p>ログイン</p>
      </div>
      <ul class="loginForm">
        <li>
          <label>
            ユーザID
            <input type="text" name="user_ID" value="" required />
          </label>
        </li>
        <li>
          <label>
            パスワード
            <input type="text" name="password" value="" required />
          </label>
        </li>
      </ul>
      <button type="button" class="login_button">
        <p>ログイン</p>
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
