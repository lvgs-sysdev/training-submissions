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
    alert(error.message);
  }
})
