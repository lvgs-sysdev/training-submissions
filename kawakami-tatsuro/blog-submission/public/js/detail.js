"use strict";

import {
  fetchData,
  formatDate,
  getParamsFromCurrentUrl,
  createArticleList,
  getCurrentUser,
  displayEditButton
} from "./utils.js";

const NUMBER_OF_DISPLAYED_NEW_ARTICLES = 3; // 表示する新着記事の数
const NUMBER_OF_DISPLAYED_USERS = 5; // 表示する投稿者の数

// 記事詳細を表示する箇所のDOM要素を取得する
const getArticleDetailElements = () => {
  const authorLink = document.getElementById("js-author-link");
  const authorImg = document.getElementById("js-author-img");
  const authorName = document.getElementById("js-author-name");
  const updatedDate = document.getElementById("js-updated-date");
  const articleGenre = document.getElementById("js-article-genre");
  const articleTitle = document.getElementById("js-article-title");
  const content = document.getElementById("js-content-paragraph");
  const genreTag = document.getElementById("js-content-genre");

  return {
    authorLink,
    authorImg,
    authorName,
    updatedDate,
    articleGenre,
    articleTitle,
    content,
    genreTag,
  };
};

// 記事詳細をDOMに表示する
const displayArticleDetail = (article) => {
  const {
    authorLink,
    authorImg,
    authorName,
    updatedDate,
    articleGenre,
    articleTitle,
    content,
    genreTag,
  } = getArticleDetailElements();

  authorLink.setAttribute("href", `/user.html?id=${article.user_pk_id}`)
  authorImg.setAttribute("src", article.icon_path);
  authorName.textContent = article.user_name;
  updatedDate.textContent = formatDate(article.updated_at);
  articleGenre.textContent = article.genre;
  articleTitle.textContent = article.article_title;
  content.innerText = article.content;
  genreTag.textContent = article.genre;
};

// 新着記事一覧を表示する
const displayNewArticles = (articles, id) => {
  const sortedArticles = articles
    .filter((article) => article.id !== id)
    .slice(0, NUMBER_OF_DISPLAYED_NEW_ARTICLES);
  console.log(sortedArticles);

  createArticleList(sortedArticles, "js-new-article-list-box");

  const newArticleContents = document.querySelectorAll(".article-list__col__item-text");

  // 記事本文は不要なので削除する
  newArticleContents.forEach((newArticleContent) => {
    newArticleContent.remove();
  });
};

// 関連記事一覧を表示する
const displayRelatedArticles = (articles, mainArticle) => {
  const relatedArticles = articles.filter(
    (article) =>
      article.id !== mainArticle.id && article.genre === mainArticle.genre
  );

  // 同ジャンルの記事がなかった場合は関連記事一覧を表示しない
  if (relatedArticles.length === 0) {
    document.querySelector('.article-list').remove();
    return;
  }

  createArticleList(relatedArticles, "js-related-article-list-box");
};

// 受け取ったユーザーの配列の順序をランダムに入れ替える
const randomizeUsersList = (users) => {
  const cloneUsers = [...users];

  for (let i = cloneUsers.length - 1; i >= 0 ; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    let tmpStorage = cloneUsers[i];
    cloneUsers[i] = cloneUsers[rand];
    cloneUsers[rand] = tmpStorage;
  }

  return cloneUsers;
};

// 投稿者一覧のDOM要素を生成する
const createUserElement = (user) => {
  const a = document.createElement('a')
  const img = document.createElement('img');
  const p = document.createElement('p');

  a.classList.add('sidebar__author__item');
  img.classList.add('sidebar__author__photo');
  p.classList.add('sidebar__author__name');

  a.setAttribute('href', `/user.html?id=${user.id}`)
  img.setAttribute('src', user.icon_path);
  img.setAttribute('alt', `${user.user_name}のプロフィール画像`)
  
  p.textContent = user.user_name;

  a.appendChild(img);
  a.appendChild(p);

  return a;
};

// 投稿者一覧を表示する
const displayUsersList = (users) => {
  const randomizedUsers = randomizeUsersList(users);
  const displayedUsers = randomizedUsers.slice(0, NUMBER_OF_DISPLAYED_USERS);
  
  const container = document.getElementById('js-author-list-box');

  displayedUsers.forEach((user) => {
    const userElement  = createUserElement(user);
    container.appendChild(userElement);
  })
};  

// DOMの読み込み後、URLのパラメーターから該当する記事のデータを取得し、DOMに表示する
document.addEventListener("DOMContentLoaded", async () => {
  const id = getParamsFromCurrentUrl("id");
  const article = await fetchData(`/article/${id}`);
  const articles = await fetchData("/articles");
  const users = await fetchData("/users");
  const currentUser = await getCurrentUser()

  displayArticleDetail(article);
  displayNewArticles(articles, article.id);
  displayRelatedArticles(articles, article);
  displayUsersList(users);
  displayEditButton(currentUser.userId, article.user_id, `edit-article.html?id=${article.id}`);
});
