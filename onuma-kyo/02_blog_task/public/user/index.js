import * as apiClient from '../assets/js/apiClient.js';

window.onload = async function () {
  // userのidをサーバ側のメモリから取得するGetリクエスト
  const sessionInfo = await apiClient.get('/me');
  // 取得したidを使ってUser情報取得するGetリクエスト
  const apiEndpoint = `/users/by_id/${sessionInfo.id}`;
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
  //初期値設定
  document.getElementById('profile-orgUserId').value = result.userId;
  document.getElementById('profile-form-userId').value = result.userId;
  document.getElementById('profile-form-userName').value = result.userName;
  document.getElementById('profile-form-email').value = result.email;
  document.getElementById('profile-form-snsLink').value = result.snsLink;
};

document.getElementById('profile-form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission
  const orgUserId = document.getElementById('profile-orgUserId').value;
  const userId = document.getElementById('profile-form-userId').value;
  const userName = document.getElementById('profile-form-userName').value;
  const email = document.getElementById('profile-form-email').value;
  const snsLink = document.getElementById('profile-form-snsLink').value;

  const dataBody = {
    orgUserId: orgUserId,
    userId: userId,
    userName: userName,
    email: email,
    snsLink: snsLink,
  };
  const apiEndpoint = `/users/edit/${orgUserId}`;
  const csrfToken = localStorage.getItem('csrfToken');

  const result = await apiClient.put(apiEndpoint, dataBody, csrfToken);
  if (result.error) {
    // レスポンスが失敗の場合、エラーメッセージを画面表示
    document.querySelector('.form__error-message .error-message--line').innerText = JSON.stringify(
      result.message,
    );
    return;
  }
  // レスポンスが成功の場合、アラート出す。元ユーザーIDを変更。
  alert('更新完了しました。');
  document.getElementById('profile-orgUserId').value = userId;
});
