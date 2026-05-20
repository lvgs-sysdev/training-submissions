import { post } from '../assets/js/apiClient.js';

document.getElementById('register-form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission
  const userId = document.getElementById('register-form-userId').value;
  const userName = document.getElementById('register-form-userName').value;
  const password = document.getElementById('register-form-password').value;
  const email = document.getElementById('register-form-email').value;
  const snsLink = document.getElementById('register-form-snsLink').value;

  const dataBody = {
    userId: userId,
    userName: userName,
    password: password,
    email: email,
    snsLink: snsLink,
  };
  const apiEndpoint = '/users/new';

  const result = await post(apiEndpoint, dataBody);
  if (result.error) {
    // レスポンスが失敗の場合、エラーメッセージを画面表示
    document.querySelector('.form__error-message .error-message--line').innerText = JSON.stringify(
      result.message,
    );
    return;
  }
  // レスポンスが成功の場合、アラート出して画面遷移
  alert('登録完了しました。ログイン画面に遷移します。');
  window.location.href = '/login';
});
