import * as apiClient from './assets/js/apiClient.js';

window.onload = async function () {
  // userのidをサーバ側のメモリから取得するGetリクエスト
  const sessionInfo = await apiClient.get('/me');
  // ログイン済の場合、ログイン/新規登録ボタンの代わりに、ログアウト/プロフィールボタンを表示
  if (sessionInfo.id) {
    document.querySelector('.header__btn-list').innerHTML = `
        <li>
          <button id="logout-button" class="header__btn-login">Logout</button>
        </li>
        <li>
          <a class="header__btn-register" href="/user">PROFILE</a>
        </li>
    `;
    document.getElementById('logout-button').addEventListener('click', async () => {
      const apiEndpoint = '/logout';

      const result = await apiClient.get(apiEndpoint);
      if (result.error) {
        // レスポンスが失敗の場合、エラーメッセージを画面表示
        alert(result.message);
        return;
      }
      localStorage.removeItem('csrfToken');
      // レスポンスが成功の場合、アラート出して画面遷移
      alert('ログアウトしました。トップ画面に遷移します。');
      window.location.href = '/';
    });
  }

  const apiEndpoint = '/articles?limit=6';
  console.log(apiEndpoint);
  const result = await apiClient.get(apiEndpoint);
  console.log(result);
  if (result.error) {
    // レスポンスが失敗の場合、エラーメッセージを画面表示
    document.querySelector('.form__error-message .error-message--line').innerText = JSON.stringify(
      result.message,
    );
    return;
  }

  const eGrid = document.querySelector('.grid');
  eGrid.innerHTML = '';
  result.map((article) => {
    const eGridItem = document.createElement('li');
    eGridItem.setAttribute('class', 'grid__item');
    eGridItem.innerHTML = `
        <article class="card">
          <a href="#" class="card__link">
            <div class="card__image-frame">
              <img class="card__image" src="./assets/images/article-1.png" alt="" />
            </div>
            <div class="card__info">
              <div class="card__label">
                <span class="card__category"></span>
                <time class="card__time" datetime="2022-02-19"></time>
              </div>
              <h3 class="card__headline"></h3>
              <p class="card__description"></p>
            </div>
          </a>
        </article>
    `;

    eGridItem.querySelector('.card__link').setAttribute('href', `/detail/${article.id}`);
    eGridItem.querySelector('.card__image').setAttribute('alt', `${article.articleTitle}の写真`);
    // htmlとして解析されないようテンプレートリテラル内で変数参照せず、textContentを使って設定
    eGridItem.querySelector('.card__time').textContent = article.updateAt;
    eGridItem.querySelector('.card__headline').textContent = article.articleTitle;
    eGridItem.querySelector('.card__description').textContent = article.content;
    eGridItem.querySelector('.card__category').textContent = article.tag;

    eGrid.appendChild(eGridItem);
  });

  loadImages();
};

// NOTE: 画像表示はスコープ外とするため、DOM操作で要素を非表示にする。（HTMLファイルは編集せずレイアウトは残す）
// TODO: 画像を対応する場合はこの処理を改修する
const loadImages = function () {
  document.querySelectorAll('.card__image-frame').forEach((e) => {
    e.style.display = 'none';
  });
};
