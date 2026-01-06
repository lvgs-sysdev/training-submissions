'use strict';

import { postData, validateInputs } from "./utils.js";

const registerForm = document.getElementById('js-register-form');

const MINIMUM_LENGTH_OF_PASSWORD = 8;

// ユーザー情報のバリデーションを行い、違反していた場合はそれぞれに応じたアラートを表示する
const isValidInformation = (id, password, name) => {
  if (name.trim().length === 0) {
    alert('空白のみのUser Nameを登録することはできません。')
    return false;
  }

  if (password.length < MINIMUM_LENGTH_OF_PASSWORD) {
    alert(`Passwordは${MINIMUM_LENGTH_OF_PASSWORD}以上である必要があります。`);
    return false;
  } 

  if (!validateInputs([id, password])) {
    alert('User ID, Passwordに空白は使用することができません。')
    return false;
  }

  return true;
}

// ユーザー情報入力フォームの入力値を取得し、オブジェクトとして返す
const getRegisterFormData = () => {
  const id = document.getElementById('js-register-id').value;
  const password = document.getElementById('js-register-password').value;
  const name = document.getElementById('js-register-name').value;
  
  // 入力された情報がバリデーション違反だった場合、nullを返却する
  if (!isValidInformation(id, password, name)) return null;

  const accountData = {
    userId: id,
    password: password,
    userName: name,
  }
  
  return accountData;
}

// ユーザー情報入力フォームがsubmitされたらPOSTリクエストを行ってデータを登録する
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const accountData = getRegisterFormData();

  // nullが返却された場合は何もしない
  if (!accountData) return;
  
  try {
    await postData('/register', accountData);

    alert('ユーザー登録が完了しました。ログインしてください。');
    window.location.href = '/login.html';
  } catch (error) {
    alert('ユーザーの登録に失敗しました。恐れ入りますが、再度行ってください。');
  }
})
