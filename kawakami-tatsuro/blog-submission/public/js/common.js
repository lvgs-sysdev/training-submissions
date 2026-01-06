"use strict";

import { getCurrentUser, logout } from "./utils.js";

const PATH_OF_HEADER = "../components/header.html";
const PATH_OF_FOOTER = "../components/footer.html";

// 第一引数で受け取ったセレクターに一致するDOM要素を、第二引数で受け取ったHTMLで置換する
const loadComponent = async (selector, path) => {
  const targetElement = document.querySelector(selector);
  if (!targetElement) return; // 要素がなければ何もしない

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error();

    const html = await response.text();

    targetElement.innerHTML = html;
  } catch (error) {
    targetElement.innerHTML =
      "<p>DAYDAY</p><p>コンテンツの読み込みに失敗しました。ページを再読み込みしてください。</p>";
  }
};

//　ヘッダーのログインボタンとユーザー登録ボタンを非表示にし、ログアウトボタンとマイページボタンを表示する
const updateHeaderState = (userId) => {
  const loginButton = document.querySelector(".header__nav__btn--login");
  const signUpButton = document.querySelector(".header__nav__btn--sign-up");
  const myPageButton = document.querySelector(".header__nav__btn--my-page");
  const logoutButton = document.querySelector(".header__nav__btn--logout");

  loginButton?.classList.add("hidden");
  signUpButton?.classList.add("hidden");

  myPageButton?.classList.remove("hidden");
  logoutButton?.classList.remove("hidden");

  if (logoutButton) {
    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();

      await logout();
    });
  }

  if (myPageButton) {
    myPageButton.setAttribute("href", `/user.html?id=${userId}`)
  }
};

// DOMが読み込まれたらヘッダー・フッターをcommonのHTMLファイルで置換し、ログイン中のユーザー情報を取得し、ヘッダーの状態を更新するイベントリスナー
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent(".header", PATH_OF_HEADER),
    loadComponent(".footer", PATH_OF_FOOTER),
  ]);

  const user = await getCurrentUser();
  if (user) updateHeaderState(user.id);
});
