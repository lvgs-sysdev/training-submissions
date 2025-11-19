'use strict';

// 第一引数で受け取ったセレクターに一致するDOM要素を、第二引数で受け取ったHTMLで置換する関数
const loadComponent = async (selector, path) => {
  const targetElement = document.querySelector(selector);
  if (!targetElement) return; // 要素がなければ何もしない

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error();

    const html = await response.text();

    targetElement.innerHTML = html;
  }

  catch(error) {
    targetElement.innerHTML = '<p>DAYDAY</p><p>コンテンツの読み込みに失敗しました。ページを再読み込みしてください。</p>'
  }
}

// DOMが読み込まれたらヘッダー・フッターをcommonのHTMLファイルで置換するイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('.header', '../html/common/header.html');
  loadComponent('.footer', '../html/common/footer.html');
});