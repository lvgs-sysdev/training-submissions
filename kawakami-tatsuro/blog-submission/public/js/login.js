'use strict';

import { postData } from "./utils.js";

const loginForm = document.getElementById('js-login-form');

// ログインフォームの入力値を取得し、オブジェクトとして返す
const getLoginFormData = () => {
  const id = document.getElementById('js-login-id').value;
  const password = document.getElementById('js-login-password').value;
  
  const accountData = {
    userId: id,
    password: password
  }
  
  return accountData;
}

// ログインフォームがsubmitされたらPOSTリクエストを行う
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const accountData = getLoginFormData();
  
  try {
    await postData('/login', accountData);
    window.location.href = '/';
  } catch (error) {
    if (error.status === 401) {
      alert('User IDまたはPasswordが間違っています。再度入力してください。');
    } else if (error.status === 500) {
      alert('サーバーでエラーが発生しました。恐れ入りますが、しばらく経ってから再度行ってください。');
    } else {
      alert(error.message || '予期せぬエラーが発生しました。');
    }
  }
})
