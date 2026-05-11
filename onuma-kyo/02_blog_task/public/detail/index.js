import * as apiClient from '../assets/js/apiClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const regexpCoordinates = /\/detail\/(\d+)/;
  const match = window.location.pathname.match(regexpCoordinates);

  const apiEndpoint = `/articles/${match[1]}`;
  console.log(apiEndpoint);
  const result = await apiClient.get(apiEndpoint);
  console.log(result);
  const authorInfo = await apiClient.get(`/users/${result.userId}`);

  // userのidをサーバ側のメモリから取得するGetリクエスト
  const sessionInfo = await apiClient.get('/me');
  const btnLeft = document.getElementById('header__btn--left');
  btnLeft.onclick = async () => {
    location.href = '/login';
  };
  // ログイン済の場合、かつ、ログインユーザーと記事投稿者が一致する場合に編集ボタンを表示
  if (sessionInfo.id && sessionInfo.id === authorInfo.id) {
    document.getElementById('edit-button-container').style.visibility = 'visible';
    document.getElementById('edit-button').setAttribute('href', `/editBlog/${result.id}`);
  }
  // ログイン済の場合、ログイン/新規登録ボタンの代わりに、ログアウト/プロフィールボタンを表示
  if (sessionInfo.id) {
    btnLeft.textContent = 'Logout';
    btnLeft.onclick = async () => {
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
    };

    const btnRight = document.getElementById('header__btn--right');
    btnRight.textContent = 'PROFILE';
    btnRight.setAttribute('href', '/user');
  }

  document.querySelector('[data-js="category"]').textContent = result.tag;
  document.querySelector('[data-js="tag-link"]').textContent = result.tag;
  document.querySelector('[data-js="headline"]').textContent = result.articleTitle;
  document.querySelector('[data-js="paragraph"]').textContent = result.content;
  document.querySelector('[data-js="author"]').textContent = result.userId;
  document.querySelector('[data-js="updated-time"]').textContent = result.updateAt;

  loadImages();
});

// NOTE: 画像表示はスコープ外とするため、DOM操作で要素を非表示にする。（HTMLファイルは編集せずレイアウトは残す）
// TODO: 画像を対応する場合はこの処理を改修する
const loadImages = function () {
  document.querySelectorAll('.card__image-frame').forEach((e) => {
    e.style.display = 'none';
  });
  document.querySelectorAll('.avatar__image').forEach((e) => {
    e.style.display = 'none';
  });
  document.querySelector('.review-detail__figure').style.display = 'none';
};
