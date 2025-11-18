'use strict';

import { fetchData, formatDate } from "./utils.js";

// 第一引数で受け取ったセレクターに一致するDOM要素を、第二引数で受け取ったHTMLで置換する関数
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

// DOMが読み込まれたらヘッダー・フッターをcommonのHTMLファイルで置換するイベントリスナー
document.addEventListener("DOMContentLoaded", () => {
  loadComponent(".header", "../components/header.html");
  loadComponent(".footer", "../components/footer.html");
});

// articleのジャンル、日付を格納したDOM要素を作成する
const createMetaBox = (article) => {
  const metaBox = document.createElement("div");
  const genre = document.createElement("span");
  const hr = document.createElement("hr");
  const date = document.createElement("span");

  metaBox.classList.add("article-list__col__item__desc");
  genre.classList.add("article-list__col__item__desc-genre");
  hr.classList.add("article-list__col__item__desc-hr");
  date.classList.add("article-list__col__item__desc-date");

  genre.textContent = article.genre;
  date.textContent = formatDate(article.updated_at);

  metaBox.appendChild(genre);
  metaBox.appendChild(hr);
  metaBox.appendChild(date);

  return metaBox;
}

// articleのサムネイル画像、タイトル、本文を含んだDOM要素を作成し、オブジェクトとして返却する
const createArticleMainData = (article) => {
  const img = document.createElement("img");
  const title = document.createElement("h4");
  const content = document.createElement("p");

  img.setAttribute("src", article.thumbnail_path);
  title.classList.add("article-list__col__item-title");
  content.classList.add("article-list__col__item-text");
  
  title.textContent = article.article_title;
  content.innerHTML = article.content;
  
  return {img, title, content};
}

// 個々のarticleのボックスのDOM要素を作成する
const createArticleListElement = (article) => {
  const itemBox = document.createElement("div");
  const articleDetailLink = document.createElement("a");
  
  const {img, title, content} = createArticleMainData(article);
  const metaBox = createMetaBox(article);

  itemBox.classList.add("article-list__col__item");
  articleDetailLink.classList.add("article-list__col__item__link");
  articleDetailLink.setAttribute("href", `detail/${article.id}`);
  
  articleDetailLink.appendChild(img);
  articleDetailLink.appendChild(metaBox);
  articleDetailLink.appendChild(title);
  articleDetailLink.appendChild(content);

  itemBox.appendChild(articleDetailLink);

  return itemBox;
}

// articles全件をループ処理し、記事要素をDOMに追加する
const createArticleList = (articles) => {
  const articleList = document.getElementById("js-article-list__col");

  articles.forEach((article) => {
    const itemBox = createArticleListElement(article);
    articleList.appendChild(itemBox);
  });
};

// DOMの読み込み後、articles全件を取得し、記事一覧を表示する
document.addEventListener("DOMContentLoaded", async () => {
  const articles = await fetchData("/articles");
  console.log(articles);
  createArticleList(articles);
});
