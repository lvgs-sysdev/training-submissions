import * as apiClient from '../assets/js/apiClient.js';

window.onload = async function () {
  const regexpCoordinates = /\/detail\/(\d+)/;
  const match = window.location.pathname.match(regexpCoordinates);

  const apiEndpoint = `/articles/${match[1]}`;
  console.log(apiEndpoint);
  const result = await apiClient.get(apiEndpoint);
  console.log(result);
  const authorInfo = await apiClient.get(`/users/${result.userId}`);

  // userのidをサーバ側のメモリから取得するGetリクエスト
  const sessionInfo = await apiClient.get('/me');

  // ログイン済の場合、かつ、ログインユーザーと記事投稿者が一致する場合に編集ボタンを表示
  if (sessionInfo.id && sessionInfo.id === authorInfo.id) {
    document.querySelector('.review-detail__topbar-side-area').innerHTML += `
              <div class="button button--black button--end-aligned">
                <a href="/editBlog/${result.id}" class="button__button">
                  <i class="fas fa-pen" style="color: rgb(255, 255, 255)"></i>
                  編集
                </a>
              </div>
    `;
  }
  // ログイン済の場合、プロフィールボタンを表示
  if (sessionInfo.id) {
    document.querySelector('.header__btn-list').innerHTML = `
        <li>
          <a class="header__btn-register" href="/user">PROFILE</a>
        </li>
    `;
  }

  document.querySelector('.review-detail__category').textContent = result.tag;
  document.querySelector('.review-detail__tag-link').textContent = result.tag;
  document.querySelector('.review-detail__headline').textContent = result.articleTitle;
  document.querySelector('.review-detail__paragraph').textContent = result.content;
  document.querySelector('.review-detail__topbar .avatar__name').textContent = result.userId;
  document.querySelector('.review-detail__topbar .review-detail__time').textContent =
    result.updateAt;

  loadImages();
};

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
