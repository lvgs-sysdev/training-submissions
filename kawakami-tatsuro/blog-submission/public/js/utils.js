'use strict';

// 引数のURIにHTTPリクエストをして受け取ったレスポンスをJSON形式でreturnする
export const fetchData = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) throw new Error();

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// 引数で受け取った日付を01 Jan 2025のような形式にフォーマットする
export const formatDate = (date) => {
  const dateObj = new Date(date);
  const options = {
      timeZone: "Asia/Tokyo",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    
  const jstDate = new Intl.DateTimeFormat("en-GB", options).format(dateObj);

  return jstDate;
}

// 現在表示中のページのURLから引数に一致するパラメーターの値を取得する
export const getParamsFromCurrentUrl = (paramName) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName)
}

// articleのジャンル、日付を格納したDOM要素を作成する
export const createMetaBox = (article) => {
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
export const createArticleMainData = (article) => {
  const img = document.createElement("img");
  const title = document.createElement("h4");
  const content = document.createElement("p");

  img.setAttribute("src", article.thumbnail_path);
  img.setAttribute("alt", "サムネイル画像");
  title.classList.add("article-list__col__item-title");
  content.classList.add("article-list__col__item-text");
  
  title.textContent = article.article_title;
  content.innerHTML = article.content;
  
  return {img, title, content};
}

// 個々のarticleのボックスのDOM要素を作成する
export const createArticleListElement = (article) => {
  const itemBox = document.createElement("div");
  const articleDetailLink = document.createElement("a");
  
  const {img, title, content} = createArticleMainData(article);
  const metaBox = createMetaBox(article);

  itemBox.classList.add("article-list__col__item");
  articleDetailLink.classList.add("article-list__col__item__link");
  articleDetailLink.setAttribute("href", `detail.html?id=${article.id}`);
  
  articleDetailLink.appendChild(img);
  articleDetailLink.appendChild(metaBox);
  articleDetailLink.appendChild(title);
  articleDetailLink.appendChild(content);

  itemBox.appendChild(articleDetailLink);

  return itemBox;
}

// articles全件をループ処理し、記事要素をDOMに追加する
export const createArticleList = (articles, id) => {
  const articleList = document.getElementById(id);

  articles.forEach((article) => {
    const itemBox = createArticleListElement(article);
    articleList.appendChild(itemBox);
  });
};