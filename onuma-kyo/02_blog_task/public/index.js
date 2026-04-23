import * as apiClient from './assets/js/apiClient.js';

window.onload = async function () {
  // userのidをサーバ側のメモリから取得するGetリクエスト
  const sessionInfo = await apiClient.get('/me');
  // ログイン済の場合、ログイン/新規登録ボタンの代わりに、プロフィールボタンを表示
  if (sessionInfo.id) {
    document.querySelector('.header__btn-list').innerHTML = `
        <li>
          <a class="header__btn-register" href="/user">PROFILE</a>
        </li>
    `;
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

  document.querySelector('.grid').innerHTML = '';
  result.map((article) => {
    document.querySelector('.grid').innerHTML += `
      <li class="grid__item">
        <article class="card">
          <a href="/detail/${article.id}" class="card__link">
            <div class="card__image-frame">
              <img class="card__image" src="./assets/images/article-1.png" alt="${article.articleTitle}の写真" />
            </div>
            <div class="card__info">
              <div class="card__label">
                <span class="card__category">Travel</span>
                <time class="card__time" datetime="2022-02-19">${article.updateAt}</time>
              </div>
              <h3 class="card__headline">${article.articleTitle}</h3>
              <p class="card__description">${article.content}</p>
            </div>
          </a>
        </article>
      </li>
    `;
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
