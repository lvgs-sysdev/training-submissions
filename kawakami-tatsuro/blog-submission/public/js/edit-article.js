'use strict';

import { fetchData, getCurrentUser, getParamsFromCurrentUrl, updateData } from "./utils.js";

const articleEditForm = document.getElementById('js-article-edit-form');

// 記事編集フォームのDOM要素を取得する
const getArticleEditFormElements = () => {
  const title = document.getElementById('js-article-title');
  const genre = document.getElementById('js-article-genre');
  const content = document.getElementById('js-article-content');

  return {title, genre, content};
}

// 記事編集フォームのinput要素等の初期値を当該記事の内容に設定
const displayArticleInfo = (article) => {
  const {title, genre, content} = getArticleEditFormElements();

  title.value = article.article_title;
  genre.value = article.genre;
  content.value = article.content;
}

// 記事編集フォームの入力値を取得し、オブジェクトとして返す
const getArticleEditFormData = () => {
  const title = document.getElementById('js-article-title').value;
  const genre = document.getElementById('js-article-genre').value;
  const content = document.getElementById('js-article-content').value;

  const articleData = {
    title: title,
    genre: genre,
    content: content
  }

  return articleData;
}

// DOMの読み込み後、URLのパラメーターに対応する記事のデータを取得し、画面に表示する
document.addEventListener('DOMContentLoaded', async () => {
  const id = getParamsFromCurrentUrl("id");
  const article = await fetchData(`/article/${id}`);
  const currentUser = await getCurrentUser();

  // ログイン中のユーザーのidと記事の著者のidが異なる場合、トップにリダイレクトする
  if (currentUser.id !== article.user_pk_id) window.location.href = '/';

  displayArticleInfo(article);
})

// 記事編集フォームがsubmitされたらPUTリクエストを行ってデータを更新する
articleEditForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = getParamsFromCurrentUrl("id");
  const articleData = getArticleEditFormData();

  try {
    await updateData(`article/${id}`, articleData);

    alert('記事の編集が完了しました。');
    window.location.href = `detail.html?id=${id}`;
  } catch (error) {
    if (error.status === 401) {
      alert('セッションが切れました。再度ログインしてください。');
    } else if (error.status === 403) {
      alert('更新を行う権限がありません。')
    } else if (error.status === 404) {
      alert('存在しない記事です。');
    } else {
      alert('予期せぬエラーが発生しました。恐れ入りますが、時間をおいて再度行ってください。');
    }
  }
})
