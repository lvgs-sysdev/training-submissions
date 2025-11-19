'use strict';

import { fetchData, createArticleList } from "./utils.js";

const NUMBER_OF_DISPLAYED_ARTICLES = 6; // トップページで表示する新着記事の件数

// DOMの読み込み後、articles全件を取得し、記事一覧を表示する
document.addEventListener("DOMContentLoaded", async () => {
  const articles = await fetchData("/articles");
  const displayedArticles = articles.slice(0, NUMBER_OF_DISPLAYED_ARTICLES);
  createArticleList(displayedArticles, 'js-article-list-box');
});
