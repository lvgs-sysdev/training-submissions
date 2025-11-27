'use strict';

import { createArticleList, displayEditButton, fetchData, getCurrentUser, getParamsFromCurrentUrl } from "./utils.js";

// ユーザー情報を表示するDOM要素を取得する
const getUserInfoElements = () => {
  const userImg = document.getElementById('js-user-img');
  const userName = document.getElementById('js-user-name');
  const userArticleHeading = document.getElementById('js-user-article-heading');

  return { userImg, userName, userArticleHeading };
}

// ユーザー情報を取得する
const displayUserInfo = (user) => {
  const { userImg, userName, userArticleHeading } = getUserInfoElements();

  userImg.setAttribute('src', user.icon_path);
  userName.textContent = user.user_name;
  userArticleHeading.textContent = `${user.user_name}さんの記事`;
}

// DOMの読み込み後、URLのパラメーターからユーザー情報を取得、当該ユーザーの記事データを取得し、表示する
document.addEventListener("DOMContentLoaded", async () => {
  const id = getParamsFromCurrentUrl('id');
  const user = await fetchData(`user/${id}`)
  const articlesOfTheUser = await fetchData(`articles/${user.user_id}`)
  const currentUser = await getCurrentUser();

  displayUserInfo(user);
  createArticleList(articlesOfTheUser, 'js-user-article-list-box');
  displayEditButton(currentUser.userId, user.user_id, `/edit-profile.html?id=${user.id}`)
});