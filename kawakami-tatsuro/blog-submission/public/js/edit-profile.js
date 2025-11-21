'use strict';

import { fetchData, getParamsFromCurrentUrl, updateData } from "./utils.js";

const profileEditForm = document.getElementById('js-profile-edit-form');

// プロフィール編集フォームのDOM要素を取得する
const getProfileEditFormElements = () => {
  const id = document.getElementById('js-profile-id');
  const name = document.getElementById('js-profile-name');

  return {id, name};
}

// プロフィール編集フォームのinput要素等の初期値を当該ユーザーの内容に設定
const displayUserInfo = (user) => {
  const {id, name} = getProfileEditFormElements();

  id.value = user.user_id;
  name.value = user.user_name;
}

// プロフィール編集フォームの入力値を取得し、オブジェクトとして返す
const getProfileEditFormData = () => {
  const id = document.getElementById('js-profile-id').value;
  const name = document.getElementById('js-profile-name').value;

  const profileData = {
    userId: id,
    userName: name,
  }
  
  return profileData;
}

// DOMの読み込み後、URLのパラメーターに対応するユーザーのデータを取得し、画面に表示する
document.addEventListener('DOMContentLoaded', async () => {
  const id = getParamsFromCurrentUrl("id");
  const user = await fetchData(`/user/${id}`);

  displayUserInfo(user);
})

// プロフィール編集フォームがsubmitされたらPUTリクエストを行ってデータを更新する
profileEditForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = getParamsFromCurrentUrl('id');
  const profileData = getProfileEditFormData();
  
 updateData(`user/${id}`, profileData, `user.html?id=${id}`);
})
