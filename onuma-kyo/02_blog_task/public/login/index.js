import { post } from '../assets/js/apiClient.js';

document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission
  const userId = document.getElementById('login-form-userId').value;
  const password = document.getElementById('login-form-password').value;

  const dataBody = {
    userId: userId,
    password: password,
  };
  const apiEndpoint = '/login';

  const result = await post(apiEndpoint, dataBody);
  if (result.error) {
    // レスポンスが失敗の場合、エラーメッセージを画面表示
    document.querySelector('.form__error-message .error-message--line').innerText = JSON.stringify(
      result.message,
    );
    return;
  }
  // レスポンスが成功の場合、アラート出して画面遷移
  alert('ログインが成功しました。トップ画面に遷移します。');
  window.location.href = '/';
});
